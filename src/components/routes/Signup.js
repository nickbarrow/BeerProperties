import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createUser, signInWithGoogle } from "../../../utils/FireAuth";

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
    try { await createUser(email, password)
    } catch (error) { setError(error) }
  }

  return (
    <div className="signup pt-5">
      <h1 className="howdy">
        Howdy,<Link className="title mx-2" to="#">Stranger</Link>🤠
      </h1>
      {error && <p className="text-danger">{error}</p> }

      <p className="psst">you should</p>
      <button className="btn pbj-btn mr-2"
        onClick={async () => { await signInWithGoogle() }}>
        Sign Up with Google
      </button>

      <p className="psst">or signup w/ email</p>
      <form className="px-5" onSubmit={handleSubmit}>
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
            Sign Up
          </button>
        </div>
        
        <hr />
        <p>Already have an account? <Link to="/login">Login</Link></p>
        <Link to="/">Home</Link>
      </form>
    </div>
  )
}