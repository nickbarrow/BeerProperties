import React, { useEffect, useState } from 'react'
import { auth } from '../../utils/Firebase'
import { motion } from 'framer-motion'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

export default function Home() {
  var user = auth.currentUser || null
  const [height, setHeight] = useState(window.innerHeight)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
  }, [])

  var toggleEditing = () => {
    if (editing) setEditing(false)
    else setEditing(true)
  }

  return (
    <motion.div
      className="home"
      style={{ height: height }}>

      <img className="home-img"
        src="images/kitchen.jpg"
        alt="Beautiful Home"
      />

      <div className="home-text">
        <h1 className="mb-3">Homepage H1</h1>

        <p>
          Homepage paragraph text.
          <br/>
          Give us a call at (555) 555-5555 or schedule an appointment online:
        </p>

        <Button>Schedule an Appointment</Button>
      </div>

      <div className="image-info">
        <div className="info">
          <span>
            Photo by{' '}
            <a href="https://unsplash.com/@aahubs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Aaron Huber
            </a>{' '}
            on{' '}
            <a href="https://unsplash.com/s/photos/real-estate-house?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </a>
          </span>
        </div>

        {user && (
          <>
          <div className={`edit-info ${editing ? 'editing' : ''}`}>
            <span onClick={() => { toggleEditing() }}>Edit Homepage</span>
          </div>

          <Modal show={showModal} onHide={() => { setShowModal(false) }}>
            <Modal.Header closeButton>
              <Modal.Title>
                <b>Edit Homepage</b>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Header Text</Form.Label>
                <Form.Control type="text" placeholder="Homepage H1" />
                {/* <Form.Text className="text-muted">
                  Greeting header.
                </Form.Text> */}
                <br />
                
                <Form.Label>Paragraph Text</Form.Label>
                <Form.Control type="text" placeholder="Homepage H1" />
                <br />
                
                <Form.Label>Button Text</Form.Label>
                <Form.Control type="text" placeholder="Schedule an Appointment" />                
                <br />
                <Form.Label>Button Link</Form.Label>
                <Form.Control type="text" placeholder="appt" />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => { setShowModal(false) }}>
                Close
              </Button>
              <Button variant="primary" onClick={() => { setShowModal(false) }}>
                Save Changes
              </Button>
            </Modal.Footer>
            </Modal>
          </>
        )}
      </div>
    </motion.div>
  )
}
