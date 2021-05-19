import React, { useContext } from 'react'
import { UserContext } from '../../providers/UserProvider'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

export default function BeerFooter(props) {
  const user = useContext(UserContext)
  
  return (
    <motion.div className="beer-footer">
      <img src="images/logo_magic.png" />

      <div className="footer-right">
        {user ? (
          <Link to="/logout" className="btn btn-outline-secondary">
            Logout
          </Link>
        ) : (
          <Link to="/login" className="btn btn-outline-secondary">
            Admin Login
          </Link>
        )}
        <span className="d-block my-2">© Beer Properties 2021</span>
        <span className="d-block">Made with 🖤 in Fort Wayne</span>
      </div>
    </motion.div>
  )
}
