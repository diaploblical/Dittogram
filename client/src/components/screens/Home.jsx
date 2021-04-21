import axios from 'axios'
import React, {useState, useEffect} from 'react'

const Home = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get("/allposts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    .then(result => {
      //setData(result.data.posts)
      console.log(result)
    })
    .catch(error => {
      console.log(error)
      return
    })
  },[])
  return(
    <div className="custom-container">
      {
        data.map(item => {
          const url = 'localhost:5000' + item.photo
          console.log(url)
          return(
            <div className="card home-card">
              <h5>{item.postedBy.title}</h5>
              <div className="card-image">
                <img src={url} alt="NIGAGHONE"/>
              </div>
              <div className="card-content">
                <i className="material-icons">favorite</i>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
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