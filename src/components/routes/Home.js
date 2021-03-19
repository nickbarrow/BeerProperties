import React from 'react'
import { Link } from 'react-router-dom'
import { auth, logout } from '../../../utils/FireAuth'

export default function Home() {
  var user = auth().currentUser || null;
  
  return (
    <div className="home pt-5">
      <h1>Home</h1>
      {user ?
        <>
          <p className="psst">signed in as {user.displayName}</p>
          <button onClick={() => { logout() }}
            className="btn pbj-btn-red my-2">
            Log Out</button>
        </>
        :
        <>
          <Link to="/login" className="btn pbj-btn my-2">Login</Link>
          <br/>
          <Link to="/signup" className="btn pbj-btn-gold">Sign Up</Link>
        </>
      }
    </div>
  )
}