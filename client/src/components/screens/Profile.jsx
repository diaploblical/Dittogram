import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import axios from 'axios'

const Profile = () => {
  const [myPics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  
  useEffect(() => {
    const getMyPosts = async () => {
      try {
        let response = await axios.get("/myposts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        })
        await setPics(response.data)
        console.log(response)
      } catch(error) {
        console.log(error)
      }
    }
    getMyPosts()
  },[])
  return(
    <div className="custom-container">
      <div className="profile">
          <div>
            <img className="avatar" alt="user's avatar" />
          </div>
          <div>
            <h4>{state ? state.username : "LOADINGU LOADINGU"}</h4>
            <div className="postFollowContainer">
              
              
            </div>
          </div>
      </div>
      <div className="gallery">
        {
          myPics.map(item => {
            return(
              <img key={item._id}src={`http://localhost:5000/api/image/${item.photo}`} alt={item.title} className="item" />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile