import axios from 'axios'
import React, {useState, useEffect} from 'react'
import M from 'materialize-css'

const Home = () => {
  const [data, setData] = useState([])
  const [imageSource, setImageSource] = useState([])
  
  useEffect(() => {
    const getAllPosts = async () => {
      try {
        let response = await axios.get("/allposts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        })
        setData((await response).data)
        for (let i = 0; i < data.length; i++) {
          console.log("THIS IS MUHFUGGIN LOOP NUMBER" + i)
          let response = await axios.get(`/api/image/${data[i].photo}`)
          console.log(await response)
          setImageSource(response)
          console.log('tesst')
        }
      } catch(error) {
        M.toast({html: error, classes: "red"})
      }
    }
    getAllPosts() 
  },[])
  return(
    <div className="custom-container">
      {
        data.map(item => {
          console.log(data)
          console.log(imageSource)
          return(
            <div className="card home-card">
              <h5>{item.title}</h5>
              <div className="card-image">
                <img arc={imageSource} alt="NIGAGHONE"/>
              </div>
              <div className="card-content">
                <i className="material-icons">favorite</i>
                <h4>{item.body}</h4>
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