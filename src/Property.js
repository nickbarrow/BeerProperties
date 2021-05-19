import React, { useEffect, useState } from 'react'
import { firestore } from './utils/Firebase'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

import BeerCarousel from './components/display/BeerCarousel'

import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export default function Property(props) {
  var { id } = useParams()
  const [property, setProperty] = useState(null)

  // Pass useEffect empty array so it only runs once.
  useEffect(() => {
    firestore
      .collection('properties')
      .doc(id)
      .get()
      .then((doc) => {
        let tmpDoc = doc.data()
        tmpDoc.id = doc.id
        setProperty(tmpDoc)
      })
  }, [])

  return (
    <motion.div className="property">
      <Link to="/gallery" className="back">
        <i class="fas fa-long-arrow-alt-left"></i> <span>Back to Listings</span>
      </Link>
      {property ? (
        <motion.div
          className="property-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}>
          {props.auth && <div className="edit-property">Edit</div>}

          <div className="property-header">
            <BeerCarousel gallery={property.imageURLs} text="false" />
            <div className="property-header-details">
              <h1 className="font-weight-bold m-2">{property.title}</h1>
              <p className="property-subhead">
                <span className="rounded-pill bg-warning px-2 mr-2">
                  <b>{property.br}</b> br
                </span>
                <span className="rounded-pill bg-warning px-2 mr-2">
                  <b>{property.ba}</b> ba
                </span>
                <span className="rounded-pill bg-info px-2 mr-2">
                  1600 sq ft
                </span>
              </p>
              <p>
                $130,000
                <br />
                <span>Est. Payment: $500/mo</span>
              </p>
            </div>
          </div>

          <div className="property-details">
            <Accordion defaultActiveKey="0">
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  Details
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>{property.desc}</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  Amenities
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>Air Conditioning</Card.Body>
                </Accordion.Collapse>
              </Card>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="2">
                  Contact
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                  <Card.Body>
                    <p>
                      Call for more details:
                      <br />
                      <b>(555) 555-5555</b>
                      <br />
                      Or email:
                      <br />
                      <b>availability@beerpropertiesinc.com</b>
                    </p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </div>
        </motion.div>
      ) : (
        '🔄 Loading...'
      )}
    </motion.div>
  )
}
