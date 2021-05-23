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
  const [items, setItems] = useState([])
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
  }, [])

  // Set form state when editing existing item.
  const editItem = item => {
    setEditingItem(item)
    setShowModal(true)
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
                    <span className="card-body-fade">{item.desc}</span>
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

      {/* Property Upload/Edit Modal */}
      {user &&
        <UploadModal show={showModal}
          setShowModal={setShowModal}
          editingItem={editingItem}
          setEditingItem={setEditingItem} />
      }
      
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
