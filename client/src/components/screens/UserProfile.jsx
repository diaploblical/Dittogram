import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
  const [profile, setProfile] = useState(null)
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
        await setProfile(response.data.foundUser)
        await setPosts(response.data.foundPosts)
        return true
      } catch(error) {
        console.log(error)
      }
    }
    getMyPosts()
  },[])

  const followUser = async () => {
    try {
      let response = await axios.put('/follow', {followId: userid}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    dispatch({type: 'UPDATE', payload:{following: response.data.followingUser.following, followers: response.data.followingUser.followers}})
    localStorage.setItem('user', JSON.stringify(response.data.followingUser))
    await setProfile(response.data.userToFollow)
    console.log(response.data.userToFollow)
    } catch(error) {
      console.log(error)
    }
  }

  const unfollowUser = async () => {
    let response = axios.put('/unfollow', {unfollowId: userid}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })  
    console.log(await response)
  }

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
              {
                profile.followers ?
                <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
                <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
              }
              <div className="postFollowContainer">
                <h5>{posts.length === 1 ? posts.length + " post" : posts.length + " posts"}</h5>
                <h5>{profile.followers.length} followers</h5>
                <h5>{profile.following.length} following</h5>
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