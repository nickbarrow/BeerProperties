import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../providers/UserProvider'
import { store, firestore } from '../utils/Firebase'
import FileUploader from 'react-firebase-file-uploader'

// Display components
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

export default function UploadModal(props) {
  var user = useContext(UserContext)

  // Image upload progress bar
  const [imageUploadProgress, setImageUploadProgress] = useState(100)

  const [items, setItems] = useState([])
  const [imageNames, setImageNames] = useState(props.editingItem.imageNames || [])
  const [imageURLs, setImageURLs] = useState(props.editingItem.imageURLs || [])
  const [uploadForm, setUploadForm] = useState({
    imageNames: [],
    imageURLs: [],
    title: '',
    details: '',
    br: 0,
    ba: 0,
    price: 0
  })
  const [editingItem, setEditingItem] = useState(props.editingItem || false)
  const [deletingItem, setDeletingItem] = useState(null)

  useEffect(() => {
    if (props.editingItem) {
      setUploadForm(props.editingItem)
    }
  }, [props.editingItem])

  const handleUploadProgress = (progress) => setImageUploadProgress(progress)
  // Don't listen to 'filename', he is a LIAR.
  // Trust 'fileName', he is the real file name 🧠
  const handleImageUploadSuccess = async (filename, task) => {
    var fileName = task.snapshot.ref.name
    var link = await store.ref('images').child(fileName).getDownloadURL()


    let newForm = uploadForm
    newForm.imageNames.push(fileName)
    newForm.imageURLs.push(link)
    
    setUploadForm(newForm)
    setImageUploadProgress(0)

    if (props.editingItem)
      await firestore.collection('properties').doc(props.editingItem.id).set(newForm)
  }
  // I hope to God I never have to touch this function again
  // Actually this aint bad. still stinky tho
  const cancelUploadImage = async (imageURL) => {
    // Get file name by image URL for deletion
    // let name = imageNames.find((n) => imageURL.includes(n))
    let name = uploadForm.imageNames.find(n => imageURL.includes(n))

    // Filter out deleting file name and URL
    // setImageNames(
    //   imageNames.filter((img) => {
    //     return img !== name
    //   })
    // )
    // setImageURLs(
    //   imageURLs.filter((url) => {
    //     return url !== imageURL
    //   })
    // )
    let newForm = uploadForm
    newForm.imageNames = newForm.imageNames.filter((img) => { return img !== name })
    newForm.imageURLs = newForm.imageURLs.filter((url) => { return url !== imageURL })
    setUploadForm(newForm)

    if (props.editingItem)
      await firestore.collection('properties').doc(props.editingItem.id).set(newForm)
    
    await store
      .ref()
      .child(`images/${name}`)
      .delete()
      .catch((err) => {
        // We don't really care because the only reason
        // this would fail (probably), is if the image
        // was already deleted
      })
  }
  const handleFormChange = (value, property) => {
    let newForm = { ...uploadForm }
    newForm[property] = value
    setUploadForm(newForm)
  }
  const handleCancelUpload = async () => {
    if (!editingItem) {
      // Cleanup any uploaded images first to preserve storage
      imageURLs.forEach(url => cancelUploadImage(url))
      wipeForm()
      props.setShowModal(false)
    } else {
      wipeForm()
      props.setShowModal(false)
    }
  }
  const wipeForm = () => {
    setUploadForm({
      title: '',
      desc: '',
      br: 0,
      ba: 0,
      price: 0
    })
  }
  const handleUpload = async () => {
    if (editingItem) {
      await firestore.collection('properties').doc(editingItem.id).set({
        title: uploadForm.title,
        desc: uploadForm.desc,
        br: uploadForm.br,
        ba: uploadForm.ba,
        price: uploadForm.price,
        imageNames,
        imageURLs
      })
    } else {
      await firestore.collection('properties').add({
        title: uploadForm.title,
        desc: uploadForm.desc,
        br: uploadForm.br,
        ba: uploadForm.ba,
        price: uploadForm.price,
        imageNames,
        imageURLs
      })
    }
    // setShowModal(false)
    wipeForm()
    setEditingItem(false)
  }

  return (
    <Modal show={props.show} onHide={() => props.setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add/Edit a Property</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="add-property-form">
          
          <div className="">
            <label className="img-upload-label">
              {/* Upload Image(s) */}
                <FileUploader
                hidden
                multiple
                accept="image/*"
                name="propertyImg"
                randomizeFilename
                storageRef={store.ref('images')}
                onProgress={handleUploadProgress}
                onUploadSuccess={handleImageUploadSuccess}
                onError={(error) => {
                  console.log(error)
                }}
              />
              <div className="img-upload-btn"></div>
              <p>Upload Image(s)</p>
            </label>
            <div
              className="img-progress"
              style={{ width: imageUploadProgress + '%' }}></div>
          </div>

          <div className="uploading-images">
            {uploadForm.imageURLs?.map((src, index) => {
              return (
                <div className="uploading-image-container d-inline-block">
                  <img className="uploading-image" src={src} />
                  <div
                    className="cancel-image"
                    onClick={() => {
                      cancelUploadImage(src)
                    }}>
                    <i className="fas fa-times"></i>
                  </div>
                </div>
              )
            })}
          </div>

          <label htmlFor="basic-url">Title</label>
          <InputGroup className="mb-3">
            <input
              className="form-control"
              value={uploadForm.title}
              placeholder="12345 Example St."
              onChange={(e) => {
                handleFormChange(e.target.value, 'title')
              }}
            />
          </InputGroup>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Details</Form.Label>
            <textarea
              className="form-control"
              rows="3"
              value={uploadForm.desc}
              placeholder="12345 Example St."
              onChange={(e) => {
                handleFormChange(e.target.value, 'desc')
              }}
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Bedrooms</Form.Label>
            <input
              className="form-control"
              type="number"
              min="1"
              max="10"
              value={uploadForm.br}
              onChange={(e) => {
                handleFormChange(e.target.value, 'br')
              }}
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Bathrooms</Form.Label>
            <input
              className="form-control"
              type="number"
              min="1"
              max="10"
              value={uploadForm.ba}
              onChange={(e) => {
                handleFormChange(e.target.value, 'ba')
              }}
            />
          </Form.Group>

          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>List Price</Form.Label>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
              </InputGroup.Prepend>
              <input
                className="form-control"
                value={uploadForm.price}
                onChange={(e) => {
                  handleFormChange(e.target.value, 'price')
                }}
              />
            </InputGroup>
          </Form.Group>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancelUpload}>
          Cancel
            </Button>
        <Button variant="primary" onClick={handleUpload}>
          Upload
            </Button>
      </Modal.Footer>
    </Modal>
  )
}