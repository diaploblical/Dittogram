import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
import M from 'materialize-css'

const Profile = () => {
  const [myPics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const [avatar, setAvatar] = useState('')
  const [url, setUrl] = useState('')
  
  const uploadAvatar = async () => {
    const formData = new FormData()
    try {
      formData.append('file', avatar, avatar.name)
      let response = await axios.post('/imageupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
          'Filename': avatar.name
        }
      })
      M.toast({html: response.data.message, classes: 'green'})
      setUrl(response.data.photo)
    } catch(error) {
      M.toast({html: error.response.data.message, classes: 'red'})
    }
  }

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        let response = await axios.get('/myposts', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        await setPics(response.data)
      } catch(error) {
        console.log(error)
      }
    }
    getMyPosts()
  },[])
  
  return(
    <div className='custom-container'>
      <div className='profile'>
        <div>
          <img className='avatar' src={state ? state.avatar : 'loading...'} alt="user's avatar" />
          <div className='file-field input-field'>
            <div className='btn waves-effect waves-light blue'>
              <span id='fileSpan'>File</span>
              <input type='file' id ='file' onChange={(e)=>setAvatar(e.target.files[0])}/>
              
            </div>
          <div className='file-path-wrapper'>
            <input className='file-path validate' type='text' />
          </div>
      </div>
      </div>
        <div>
          <h4>{state ? state.username : 'LOADINGU LOADINGU'}</h4>
          <div className='postFollowContainer'>
            <h5>{myPics.length === 1 ? myPics.length + ' post' : myPics.length + ' posts'}</h5>
            <h5>{state ? state.followers.length : '0'} followers</h5>
            <h5>{state ? state.following.length : '0'} following</h5> 
          </div>
        </div>
      </div>
      <div className='gallery'>
        {
          myPics.map(item => {
            return(
              <img key={item._id}src={`http://localhost:5000/api/image/${item.photo}`} alt={item.title} className='item' />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile