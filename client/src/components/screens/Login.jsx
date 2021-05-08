import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import axios from 'axios'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Login = () => {
  const {dispatch} = useContext(UserContext)
  const history = useHistory()
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const postData = async () => {
    if (!emailRegex.test(email)) {
      return M.toast({html: "Invalid email address", classes: "red"})
    }   
    try {
      let response = await axios.post("/login", {email, password}, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      localStorage.setItem("jwt", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      dispatch({type: "USER", payload: response.data.user})
      M.toast({html: response.data.message, classes: "green"})
      history.push('/')
    } catch(error) {
      console.log()
      M.toast({html: error.response.data.message, classes: "red"})
    }
  }
  return(
    <div className="my-card">
      <div className="card auth-card input-field">
        <h2>Log in</h2>
        <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn waves-effect waves-light blue" name="action" onClick={postData}>Log in</button>
        <h5>
          <Link to="/signup">Register here</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login