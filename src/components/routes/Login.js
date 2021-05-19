import React, { useState } from 'react'
import { Link } from 'react-router-dom'
// Firebase Authorization utils:
import { signIn } from '../../utils/FireAuth'

import { signInWithGoogle } from '../../utils/Firebase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  // Update state values as they are typed.
  var handleChange = (e) => {
    e.target.name === email
      ? setEmail(e.target.value)
      : setPassword(e.target.value)
  }

  // Attempt login with email & password.
  var handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signIn(email, password)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <div className="login">
      {/* Incorrect user/password */}
      {error && <p className="text-danger">{error}</p>}

      <form
        className="login-form px-5"
        autoComplete="off"
        onSubmit={handleSubmit}>
        <button
          className="btn btn-primary"
          type="button"
          onClick={async () => {
            await signInWithGoogle()
          }}>
          Log In with Google
        </button>
      </form>
    </div>
  )
}
