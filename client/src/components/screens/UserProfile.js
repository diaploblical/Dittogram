import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
  const [myPics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const {userid} = useParams()
  console.log(userid)
  
  // useEffect(() => {
  //   const getMyPosts = async () => {
  //     try {
  //       let response = await axios.get("/myposts", {
  //         headers: {
  //           "Authorization": "Bearer " + localStorage.getItem("jwt")
  //         }
  //       })
  //       setPics(await response.data.myPost)
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   }
  //   getMyPosts()
  // },[])
  return(
    <div className="custom-container">
      <div className="profile">
          <div>
            <img className="avatar" alt="robot" />
          </div>
          <div>
            <h4>{state ? state.username : "LOADINGU LOADINGU"}</h4>
            <div className="postFollowContainer">
              <h5>L</h5>
              <h5>A</h5>
              <h5>G</h5>
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

export default UserProfile