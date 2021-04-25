import axios from 'axios'
import React, {useState, useEffect} from 'react'
import M from 'materialize-css'

const Home = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        let response = axios.get("/allposts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        })
        setData((await response).data)
      } catch(error) {
        M.toast({html: error.response.data.message, classes: "red"})
      }
    }
    getAllPosts() 
  },[])
  return(
    <div className="custom-container">
      {
        data.map(item => {
          console.log(item)
          return(
            <div className="card home-card">
              <h5></h5>
              <div className="card-image">
                <img alt="NIGAGHONE"/>
              </div>
              <div className="card-content">
                <i className="material-icons">favorite</i>
                <h4></h4>
                <p></p>
                <input type="text" placeholder="Add a comment"/>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default Home