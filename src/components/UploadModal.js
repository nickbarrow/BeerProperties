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
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
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

  // Update form on props change (editing an item).
  useEffect(() => {
    if (props.editingItem) setUploadForm(props.editingItem)
  }, [props.editingItem])


  const handleUploadProgress = (progress) => setImageUploadProgress(progress)
  // Don't listen to 'filename', he is a LIAR.
  // Trust 'fileName', he is the real file name 🧠
  const handleImageUploadSuccess = async (filename, task) => {
    // Get image name and URL.
    var fileName = task.snapshot.ref.name
    var link = await store.ref('images').child(fileName).getDownloadURL()
    // Update upload form, reset image upload progress.
    let newForm = uploadForm
    newForm.imageNames.push(fileName)
    newForm.imageURLs.push(link)
    setUploadForm(newForm)
    setImageUploadProgress(0)
    // Save the record if editing existing.
    if (props.editingItem)
      await firestore.collection('properties').doc(props.editingItem.id).set(newForm)
  }
  // I hope to God I never have to touch this function again
  // Actually this aint bad. still stinky tho
  const cancelUploadImage = async imageURL => {
    // Get file name by image URL for deletion.
    let name = uploadForm.imageNames.find(n => imageURL.includes(n))
    // Duplicate form and remove deleting image.
    let newForm = uploadForm
    newForm.imageNames = newForm.imageNames.filter((img) => { return img !== name })
    newForm.imageURLs = newForm.imageURLs.filter((url) => { return url !== imageURL })
    setUploadForm(newForm)
    // Update record if editing.
    if (props.editingItem)
      await firestore.collection('properties').doc(props.editingItem.id).set(newForm)
    // Actually delete the image.
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
  // Update state on form change.
  const handleFormChange = (value, property) => {
    let newForm = { ...uploadForm }
    newForm[property] = value
    setUploadForm(newForm)
  }
  // Delete all draft images and wipe form.
  const handleCancelUpload = async () => {
    if (!editingItem) {
      // Cleanup any uploaded images first to preserve storage
      uploadForm.imageURLs.forEach(url => cancelUploadImage(url))
      wipeForm()
      props.setShowModal(false)
    } else {
      wipeForm()
      props.setShowModal(false)
    }
  }
  // Empty form inputs.
  const wipeForm = () => {
    setUploadForm({
      title: '',
      desc: '',
      br: 0,
      ba: 0,
      price: 0
    })
  }
  // Create record or Update if editing.
  const handleUpload = async () => {
    if (editingItem) await firestore.collection('properties').doc(editingItem.id).set(uploadForm)
    else await firestore.collection('properties').add(uploadForm)
    props.setShowModal(false)
    wipeForm()
    setEditingItem(false)
  }

  return (
    <Modal show={props.show} onHide={() => props.setShowModal(false)} dialogClassName="upload-modal">
      <Modal.Header closeButton>
        <Modal.Title>Add/Edit a Property</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="add-property-form">
          
          <div className="">
            <label className="img-upload-label">
              <FileUploader
                hidden
                accept="image/*"
                name="propertyImg"
                randomizeFilename
                storageRef={store.ref('images')}
                onProgress={handleUploadProgress}
                onUploadSuccess={handleImageUploadSuccess}
                onError={(error) => { console.log(error) }} />
              <div className="img-upload-btn"></div>
              <p>Upload Image(s)</p>
            </label>
            <div className="img-progress" style={{ width: imageUploadProgress + '%' }}></div>
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