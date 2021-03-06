import React, {useEffect, useState, useContext} from 'react'
import { UserContext } from '../../App'
import axios from 'axios'
import M from 'materialize-css'

const Profile = () => {
  const [myPics, setPics] = useState([])
  const {dispatch} = useContext(UserContext)
  const [image, setImage] = useState('')
  const profile = JSON.parse(localStorage.getItem('user'))
  
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
    <div className='container'>
      <div className='profile row'>
        <div className='col s3'>
          <img className='avatar valign-wrapper' src={profile.avatar ? `/image/${profile.avatar}` : `/defaultavatar`} alt="user's avatar" />
          <div className='file-field input-field'>
            <div className='btn waves-effect waves-light blue'>
              <span id='fileSpan'>Select Avatar</span>
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
              <div className='file-path-wrapper'>
                <input className='file-path validate hidden' type='text' />
              </div>
            </div>
          </div>       
        </div>
        <div className='col s9'>      
          <div className='row'>
            <div className='col s4 center-align'>
              <h5>{myPics.length}</h5>
              <h5>{myPics.length === 1 ? 'post' : 'posts'}</h5>
            </div>
            <div className='col s4 center-align'>
              <h5>{profile ? profile.followers.length : '0'}</h5>
              <h5>followers</h5>
            </div>
            <div className='col s4 center-align'>
              <h5>{profile ? profile.following.length : '0'}</h5>
              <h5>following</h5>
            </div>
          </div>
        </div>
      </div>
      <div className='gallery'>
        {
          myPics.map(item => {
            return(
              <img key={item._id}src={`/image/${item.photo}`} alt={item.title} className='item' />
            )
          })
        }
      </div>
    </div>
  )
}

export default Profile