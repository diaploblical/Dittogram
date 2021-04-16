import React from 'react'
import {Link} from 'react-router-dom'

const Signup = () => {
  return(
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Sign up</h2>
        <input type="text" placeholder="username" />
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <input type="text" placeholder="confirm password" />
        <button className="btn waves-effect waves-light blue" type="submit" name="action">Sign up</button>
        <h5>
          <Link to="/login">Already have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Signup