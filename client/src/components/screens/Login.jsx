import React from 'react'

const Login = () => {
  return(
    <div className="mycard">
      <div className="card">
        <h2>Niggagram</h2>
        <input type="text" placeholder="email" />
        <input type="text" placeholder="password" />
        <button className="btn waves-effect waves-light" type="submit" name="action">Login</button>
      </div>
    </div>
  )
}

export default Login