/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import {useParams} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null)
  const profile = JSON.parse(localStorage.getItem('user'))
  const {dispatch} = useContext(UserContext)
  const {userid} = useParams()
  const [showFollow, setShowFollow] = useState(profile ? !profile.following.includes(userid) : true)
  const localhost = 'http://localhost:5000'
  
  useEffect(() => {
    const getMyPosts = async () => {
      try {
        let response = await axios.get(`/user/${userid}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        setUserProfile(response.data)
      } catch(error) {
        return M.toast({html: error.response.data.message, classes: 'red'})
      }    
    }
    getMyPosts()
  }, [])

  const followUser = async () => {
    try {
      let response = await axios.put('/follow', {followId: userid}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
      })
      dispatch({type: 'UPDATE-FOLLOWERS', payload:{following: response.data.following, followers: response.data.followers}})
      localStorage.setItem('user', JSON.stringify(response.data))
      setUserProfile((prevState)=>{
        return {...prevState, user: {...prevState.user, followers: [...prevState.user.followers, response.data._id]}
        }
      })
      setShowFollow(false)
    } catch(error) {
      return M.toast({html: error.response.data.message, classes: 'red'})
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
      dispatch({type: 'UPDATE-FOLLOWERS', payload:{following: response.data.following, followers: response.data.followers}})
      localStorage.setItem('user', JSON.stringify(response.data))
      setUserProfile((prevState)=>{
        const newFollower = (prevState.user.followers.filter(item => item !== response.data._id))
        return {...prevState, user:{...prevState.user, followers: newFollower}
        }
      })
      setShowFollow(true)   
    } catch(error) {
      return M.toast({html: error.response.data.message, classes: 'red'})
    }
  }

  return(
    <>
    {userProfile ? 
      <div className="custom-container">
        <div className="profile">
          <div>
          <img className='avatar' src={userProfile.user.avatar ? `${localhost}/api/image/${userProfile.user.avatar}` : `${localhost}/defaultavatar`} alt="user's avatar" />
          </div>
          <div>
            <h4>{userProfile.user.username}</h4>
            {
              showFollow ?
              <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => followUser()}>Follow</button> :
              <button className="btn waves-effect waves-light blue" type="submit" name="action" onClick={() => unfollowUser()}>Unfollow</button>
            }
            <div className="postFollowContainer">
              <h5>{userProfile.posts.length === 1 ? userProfile.posts.length + " post" : userProfile.posts.length + " posts"}</h5>
              <h5>{userProfile.user.followers.length} followers</h5>
              <h5>{userProfile.user.following.length} following</h5>
            </div>
          </div>
        </div>
        <div className="gallery">
          {
            userProfile.posts.map(item => {
              return(
                <img key={item._id} src={`http://localhost:5000/api/image/${item.photo}`} alt={item.title} className="item" />
              )
            })
          }
        </div>
      </div>
    : <h2>loading</h2>}
    </>
  )
}

export default UserProfile