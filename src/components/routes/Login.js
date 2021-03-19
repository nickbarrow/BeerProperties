import React, { useState } from "react"
import { Link } from "react-router-dom"
// Firebase Authorization utils:
import { signIn, signInWithGoogle } from '../../../utils/FireAuth'

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  
  // Update state values as they are typed.
  var handleChange = (e) => {
    e.target.name === email
      ? setEmail(e.target.value)
      : setPassword(e.target.value)
  }

  // Attempt login with email & password.
  var handleSubmit = async (e) => {
    e.preventDefault();
    try { await signIn(email, password)
    } catch (error) { setError(error) }
  }

  return (
    <div className="login pt-5">
      <h1 className="howdy">
        Howdy,<Link className="title mx-2" to="#">Partner</Link>🤠
      </h1>
      
      {/* Incorrect user/password */}
      {error && <p className="text-danger">{error}</p> }

      <form className="login-form px-5" autoComplete="off" onSubmit={handleSubmit}>
        <p className="psst">you should</p>
        <button className="btn pbj-btn"
          type="button"
          onClick={async () => { await signInWithGoogle() }}>
          Log In with Google
        </button>

        <p className="psst">or login w/ email</p>
        <div className="form-group my-2">
          <input className="form-control"
            placeholder="Email"
            name="email"
            type="email"
            onChange={handleChange}
            value={email} />
        </div>
        <div className="form-group">
          <input className="form-control"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={password}
            type="password" />
        </div>

        <div className="form-group">
          <button className="btn pbj-btn-gold" type="submit">
            Login
          </button>
        </div>

        <hr />

        <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        <Link to="/">Home</Link>
      </form>
    </div>
  )
}