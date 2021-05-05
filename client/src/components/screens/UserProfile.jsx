import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
  const [profile, setProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const {userid} = useParams()
  const [showFollow, setShowFollow] = useState(state?!state.following.includes(userid):true)
  
  useEffect(() => {
    const getMyPosts = async () => {
      try {
        let response = await axios.get(`/user/${userid}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        await setProfile(response.data)
      } catch(error) {
        console.log(error)
      }
    }
    getMyPosts()
  },[])
  console.log(profile)
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
    console.log(response.data)
    await setProfile(response.data)
    setShowFollow(false)
    } catch(error) {
      console.log(error)
    }
  }

  const unfollowUser = async () => {
    try {
      let response = await axios.put('/unfollow', {unfollowId: userid}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    })
    dispatch({type: 'UPDATE', payload:{following: response.data.unfollowingUser.following, followers: response.data.unfollowingUser.followers}})
    localStorage.setItem('user', JSON.stringify(response.data.unfollowingUser))
    await setProfile(response.data.user)
    setShowFollow(true)
    } catch(error) {
      console.log(error)
    }
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
                showFollow ?
                <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
                <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
              }
              <div className="postFollowContainer">
                <h5>{profile.posts.length === 1 ? profile.posts.length + " post" : profile.posts.length + " posts"}</h5>
                <h5>{profile.user.followers.length} followers</h5>
                <h5>{profile.user.following.length} following</h5>
              </div>
            </div>      
        </div>
        <div className="gallery">
          {
            profile.posts.map(item => {
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