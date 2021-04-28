import axios from 'axios'
import React, {useState, useEffect} from 'react'
import M from 'materialize-css'

const Home = () => {
  const [data, setData] = useState([])
  
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        let response = await axios.get("/allposts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        })
        setData((await response).data)
      } catch(error) {
        M.toast({html: error, classes: "red"})
      }
    }
    getAllPosts() 
  },[])
  const likePost = async (id) => {
    let response = await axios.put("/like", {postId: id}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(await newData)
      console.log(data)
    } catch(error) {
      console.log(data)
      console.log(error)
    }
  }
  const unlikePost = async (id) => {
    let response = await axios.put("/unlike", {postId: id}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(newData)
    } catch(error) {
      console.log(error)
    }
  }
  return(
    <div className="custom-container">
      {
        data.map(item => {
          return(
            <div className="card home-card">            
              <div className="card-image">
                <img src={`http://localhost:5000/api/image/${item.photo}`} alt="NIGAGHONE"/>
              </div>
              <div className="card-content">
                <i className="material-icons mi-margins">favorite</i>
                <i className="material-icons mi-margins" onClick={() => {likePost(item._id)}}>thumb_up</i>
                <i className="material-icons mi-margins" onClick={() => {unlikePost(item._id)}}>thumb_down</i>
                <h6>{item.likes.length} likes</h6>
                <h5>{item.title}</h5>
                <h6>{item.body}</h6>
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