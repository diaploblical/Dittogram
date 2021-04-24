import React, {useState} from 'react'
import axios from 'axios'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const history = useHistory()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const postData = async () => {
    if (!emailRegex.test(email)) {
      M.toast({html: "invalid email address", classes: "red"})
    } else {
      try {
        let response = await axios.post("/signup", {username, email, password}, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        console.log(response)
        M.toast({html: response.data.message, classes: "green"})
        history.push('/')
      } catch(error) {
        M.toast({html: error.message, classes: "red"})
      }
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

//

export default Signup