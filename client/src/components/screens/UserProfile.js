import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
  const [profile, setProfile] = useState([])
  const [posts, setPosts] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const {userid} = useParams()
  
  useEffect(() => {
    const getMyPosts = async () => {
      try {
        let response = await axios.get(`/user/${userid}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        console.log(await response.data.foundUser.username)
        setProfile(await response.data.foundUser)
        setPosts(await response.data.foundPosts)
      } catch(error) {
        console.log(error)
      }
    }
    getMyPosts()
  },[])
  return(
    <>
    {profile ? 
      <div className="custom-container">
        <div className="profile">
            <div>
              <img className="avatar" alt="robot" />
            </div>
            <div>
              <h4>{profile.username}</h4>
              <div className="postFollowContainer">
                <h5>{posts.length === 1 ? posts.length + " post" : posts.length + " posts"}</h5>
              </div>
            </div>
        </div>
        <div className="gallery">
          {
            posts.map(item => {
              return(
                <img src={`http://localhost:5000/api/image/${item.photo}`} alt={item.title} className="item" />
              )
            })
          }
        </div>
      </div>
    : <h2>LOADINGU LOADINGU</h2>}
    </>
  )
}

export default UserProfile