import React, { useState } from 'react'

import { Link } from 'react-router-dom'

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

export default function BeerNav(props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Navbar expanded={expanded} expand="lg">
      <Navbar.Brand>
        <Link to="/" onClick={() => setExpanded(false)}>
          <img
            alt=""
            src="images/logo_magic.png"
            className="nav-logo d-inline-block align-top"
          />
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle
        onClick={() => setExpanded(!expanded)}
        aria-controls="responsive-navbar-nav"
      />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link
            to="/"
            className="nav-link"
            onClick={() => setExpanded(false)}>
            Home
          </Link>

          <Link
            to="/gallery"
            className="nav-link"
            onClick={() => setExpanded(false)}>
            Listings
          </Link>

          <Nav.Link>
            Contact Us
            <i
              className="fas fa-mobile-alt ml-3"
              style={{ transform: 'rotate(30deg)' }}></i>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}
