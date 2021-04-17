import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Login = () => {
  const history = useHistory()
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const PostData = () => {
    if (!emailRegex.test(email)) {
      M.toast({html: "invalid email address", classes: "red"})
    } 
    else {
      fetch("/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }).then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.error) {
          M.toast({html: data.error, classes: "red"})
          console.log(data)
        }
        else {
          M.toast({html: data.message, classes: "green"})
          history.push('/')
        }
      }).catch(err => {
        console.log(err)
      })
    } 
  }
  return(
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Log in</h2>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light blue" name="action" onClick={PostData}>Log in</button>
        <h5>
          <Link to="/signup">Register here</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login