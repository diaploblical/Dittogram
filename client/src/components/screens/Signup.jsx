import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const postData = () => {
    if (!emailRegex.test(email)) {
      M.toast({html: "invalid email address", classes: "red"})
    } 
    else {
      fetch("/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      }).then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({html: data.error, classes: "red"})
          console.log(data)
        }
        else {
          M.toast({html: data.message, classes: "green"})
        }
      }).catch(err => {
        console.log(err)
      })
    } 
  }

  return(
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Sign up</h2>
        <input type="text" placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={postData}>Sign up</button>
        <h5>
          <Link to="/login">Already have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Signup