import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../providers/UserProvider'
import { store, firestore } from '../../utils/Firebase'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FileUploader from 'react-firebase-file-uploader'

// Display components
import BeerCarousel from '../display/BeerCarousel'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import UploadModal from '../UploadModal'

export default function Gallery() {
  var user = useContext(UserContext)
  // Modal display state
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(false)

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  // Image upload progress bar
  const [imageUploadProgress, setImageUploadProgress] = useState(100)

  const [items, setItems] = useState([])
  const [imageNames, setImageNames] = useState([])
  const [imageURLs, setImageURLs] = useState([])
  const [uploadForm, setUploadForm] = useState({})
  const [deletingItem, setDeletingItem] = useState(null)

  useEffect(() => {
    firestore.collection('properties').onSnapshot((snapshot) => {
      let tmpItems = []
      snapshot.forEach((snap) => {
        let tmpItem = snap.data()
        tmpItem.id = snap.id
        tmpItems.push(tmpItem)
      })
      // Sort property listing (by title asc)
      tmpItems.sort((a, b) => {
        return a.title[0] - b.title[0]
      })
      setItems(tmpItems)
    })
  }, [uploadForm, imageURLs])

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
    setShowModal(false)
    wipeForm()
    setEditingItem(false)
  }
  const handleCancelUpload = async () => {
    setShowModal(false)
    wipeForm()
  }

  // Don't listen to 'filename', he is a LIAR.
  // Trust 'fileName', he is the real file name 🧠
  const handleImageUploadSuccess = async (filename, task) => {
    var fileName = task.snapshot.ref.name
    var link = await store.ref('images').child(fileName).getDownloadURL()
    setImageNames((old) => [...old, fileName])
    setImageURLs((old) => [...old, link])
    setImageUploadProgress(0)
  }
  const handleUploadProgress = (progress) => setImageUploadProgress(progress)
  // I hope to God I never have to touch this function again
  const cancelUploadImage = async (imageURL) => {
    // Get file name by image URL for deletion
    let name = imageNames.find((n) => imageURL.includes(n))

    // Filter out deleting file name and URL
    setImageNames(
      imageNames.filter((img) => {
        return img !== name
      })
    )
    setImageURLs(
      imageURLs.filter((url) => {
        return url !== imageURL
      })
    )
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

  // Set form state when editing existing item.
  const editItem = (item) => {
    // console.log(item)
    // setUploadForm({
    //   title: item.title,
    //   desc: item.desc,
    //   br: item.br,
    //   ba: item.ba,
    //   price: item.price
    // })
    // setImageNames(item.imageNames)
    // setImageURLs(item.imageURLs)
    // setEditingItem(item)
    setEditingItem(item)
    setShowModal(true)
  }
  const handleFormChange = (value, property) => {
    let newForm = { ...uploadForm }
    newForm[property] = value
    setUploadForm(newForm)
  }

  const deleteProperty = async () =>
    await firestore.collection('properties').doc(deletingItem.id).delete()

  return (
    <motion.div
      className="gallery"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {user && (
        <Button
          variant="outline-success"
          style={{width: "100%"}}
          onClick={() => { setShowModal(true) }}>
          Upload
        </Button>
      )}
      {items ? (
        <motion.div className="card-grid">

          {items.map((item, index) => {
            return (
              <Card key={index}>
                <BeerCarousel gallery={item.imageURLs} text="false" />

                <Card.Body>
                  <Card.Title>
                    <Link to={'/p/' + item.id}>{item.title}</Link>
                  </Card.Title>
                  <p className="lead">
                    $<b>{item.price}</b>
                  </p>
                  <p className="br-pill mr-2">{item.br}br</p>
                  <p className="ba-pill">{item.ba}ba</p>
                  <Card.Text>
                    <div className="card-body-fade">{item.desc}</div>
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <small className="text-muted">Last updated 3 mins ago</small>
                  {user && (
                    <>
                      <Button
                        variant="primary"
                        className="d-block w-100 my-2"
                        onClick={() => {
                          editItem(item)
                        }}>
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        className="d-block w-100"
                        onClick={() => {
                          setDeletingItem(item)
                          setShowDeleteConfirmation(true)
                        }}>
                        Delete
                      </Button>
                    </>
                  )}
                </Card.Footer>
              </Card>
            )
          })}
        </motion.div>
      ) : (
        '🔄 Loading...'
      )}

      {/* Property Edit/Upload Modal */}
      <UploadModal show={showModal} setShowModal={setShowModal} editingItem={editingItem} />
      {/* <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false)
        }}>
        <Modal.Header closeButton>
          <Modal.Title>Add/Edit a Property</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="add-property-form">
            <div className="">
              <label className="btn btn-success w-100">
                Upload Image(s)
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
              </label>
              <div
                className="img-progress"
                style={{ width: imageUploadProgress + '%' }}></div>
            </div>

            <div className="uploading-images">
              {imageURLs.map((src, index) => {
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
      </Modal> */}

      {/* Item deletion confirmation */}
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>Are you sure you want to delete this property?</p>
          <p>{deletingItem?.title}</p>
          <p style={{ fontSize: '10px' }}>{deletingItem?.id}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteProperty()
              setShowDeleteConfirmation(false)
            }}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  )
}
