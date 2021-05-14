import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
import M from 'materialize-css'

const Profile = () => {
  const [myPics, setPics] = useState([])
  const {dispatch} = useContext(UserContext)
  const [image, setImage] = useState('')
  const profile = JSON.parse(localStorage.getItem('user'))
  const localhost = 'http://localhost:5000'
  
  const uploadAvatar = async () => {
    const formData = new FormData()
    try {
      formData.append('file', image, image.name)
      let response = await axios.post('/imageupload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
          'Filename': image.name
        }
      })
      if (response.data.photo) {
        const passedPhoto = response.data.photo.split('.').shift()
        let secondResponse = await axios.put('/setavatar', {avatarId: passedPhoto}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        localStorage.setItem('user', JSON.stringify(secondResponse.data))
        dispatch({type: 'UPDATE-AVATAR', payload:{avatar: secondResponse.data.avatar}})
      }
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
        M.toast({html: error.response.data.message, classes: 'red'})
      }
    }
    getMyPosts()
  },[])

  return(
    <div className='custom-container'>
      <div className='profile'>
        <div>
          <img className='avatar' src={profile.avatar ? `${localhost}/api/image/${profile.avatar}` : `${localhost}/defaultavatar`} alt="user's avatar" />
          <div className='file-field input-field'>
            <div className='btn waves-effect waves-light blue'>
              <span className='float-center' id='fileSpan'>Select Avatar</span>
              <input type='file' 
                onChange={(e)=> {
                    setImage(e.target.files[0])
                    document.querySelector('#fileSpan').innerHTML = 'Upload Avatar'
                  }
                }
                onClick={(e) => {
                  if (image) {
                    e.preventDefault()
                    uploadAvatar()
                  }
                }}
              />
            </div>
            <div className='file-path-wrapper'>
              <input className='file-path validate hidden' type='text' />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4>{profile ? profile.username : 'loading'}</h4>
        <div className='postFollowContainer'>
          <h5>{myPics.length === 1 ? myPics.length + ' post' : myPics.length + ' posts'}</h5>
          <h5>{profile ? profile.followers.length : '0'} followers</h5>
          <h5>{profile ? profile.following.length : '0'} following</h5>
        </div>
        <div className="container">
          <button className='btn'>YEA</button>
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