import React from 'react'
import {Link} from 'react-router-dom'

const Login = () => {
  return(
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Log in</h2>
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <button className="btn waves-effect waves-light blue" type="submit" name="action">Log in</button>
        <h5>
          <Link to="/signup">Register here</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login