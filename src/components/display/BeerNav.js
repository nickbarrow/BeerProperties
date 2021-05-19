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
            to="/gallery"
            className="nav-link"
            onClick={() => setExpanded(false)}>
            Listings
          </Link>

          <NavDropdown title="Admin Tools" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>

        <Nav>
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
