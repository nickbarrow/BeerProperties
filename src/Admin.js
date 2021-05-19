import React, { useEffect, useState } from 'react'
import { homesRef, store } from './utils/Firebase'
import FileUploader from 'react-firebase-file-uploader'

import { motion } from 'framer-motion'

// Bootstrap
import Jumbotron from 'react-bootstrap/Jumbotron'
import Button from 'react-bootstrap/Button'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Modal from 'react-bootstrap/Modal'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'

export default function Admin(props) {
  const [homes, setHomes] = useState([])
  const [show, setShow] = useState(false)
  const [uploadImage, setUploadImage] = useState('')
  const [imageUploadProgress, setImageUploadProgress] = useState(0)
  const [uploadStreetAddress, setUploadStreetAddress] = useState('')
  const [uploadText, setUploadText] = useState('')

  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  const handleUpload = () => {
    homesRef.push({
      image: uploadImage,
      streetAddress: uploadStreetAddress,
      text: uploadText
    })
    handleClose()
  }

  const handleUploadProgress = (progress) => {
    setImageUploadProgress(progress)
  }

  const handleImageUploadSuccess = (filename, task) => {
    // Get URL of stored image and update user photoURL.
    store
      .ref('images')
      .child(task.snapshot.ref.name)
      .getDownloadURL()
      .then((url) => setUploadImage(url))
    setImageUploadProgress(0)
  }

  const deleteProperty = (key) => {
    homesRef.child(key).remove()
  }

  // Pass useEffect empty array so it only runs once.
  useEffect(() => {
    // 'on' will fetch updates realtime
    homesRef.on('value', (snapshot) => {
      let tmpHomes = []
      snapshot.forEach((home) => {
        let tmpProperty = home.val()
        tmpProperty.key = home.key
        tmpHomes.push(tmpProperty)
      })
      setHomes(tmpHomes)
    })
  }, [])

  return (
    <motion.div
      className="admin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      <Jumbotron className="admin-head p-4 text-start">
        <h1 className="mb-4">Edit Gallery Examples:</h1>

        <Button className="" onClick={handleShow}>
          Add Property
        </Button>
      </Jumbotron>

      <Accordion className="properties">
        {homes.map((property, index) => {
          return (
            <Card key={property.key}>
              <Accordion.Toggle
                as={Card.Header}
                variant="link"
                eventKey={'' + index}>
                <img src={property.image} className="property-thumbnail" />
                {property.streetAddress}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={'' + index}>
                <Card.Body>
                  <img src={property.image} className="property-image" />
                  {property.text}
                  <Button
                    variant="danger"
                    onClick={() => deleteProperty(property.key)}>
                    Delete
                  </Button>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )
        })}
      </Accordion>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add a Property</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="add-property-form">
            <div className="cover-image">
              <label
                className="cover-image-input"
                style={{
                  backgroundImage: `url(${uploadImage})`
                }}>
                <FileUploader
                  hidden
                  accept="image/*"
                  name="propertyImg"
                  randomizeFilename
                  storageRef={store.ref('images')}
                  onProgress={handleUploadProgress}
                  onUploadSuccess={handleImageUploadSuccess}
                />
              </label>
              <div
                className="progress"
                style={{ width: imageUploadProgress + '%' }}></div>
            </div>

            <label htmlFor="basic-url">Street Address</label>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="12345 Example St."
                onChange={(e) => {
                  setUploadStreetAddress(e.target.value)
                }}
              />
            </InputGroup>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Property Details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                onChange={(e) => {
                  setUploadText(e.target.value)
                }}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpload}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  )
}
