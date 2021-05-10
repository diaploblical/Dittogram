/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import M from 'materialize-css'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const [photo, setPhoto] = useState('')
  const history = useHistory()
  
  useEffect(() => {
    const createPost = async() => {
      if (photo) {
        const passedPhoto = photo.split('.').shift()
        let response = await axios.post('/createpost', {title, body, photo: passedPhoto}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
          }
        })
        M.toast({html: response.data.message, classes: 'green'})
        return await history.push('/')
      } 
    }
    createPost()
  }, [photo])
  
  const postDetails = async () => {
    if (title.length  < 1) {
      return M.toast({html: 'Title is required', classes: 'red'})
    } else if (body.length < 1) {
      return M.toast({html: 'Body is required', classes: 'red'})
    } else if (image.length < 1) {
      return M.toast({html: 'Please select an image', classes: 'red'})
    } else {
      try {
        const formData = new FormData()
        formData.append('file', image, image.name)
        let response = await axios.post('/imageupload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            'Filename': image.name
          }
        })
        setPhoto(response.data.photo)
      } catch(error) {
        return M.toast({html: error.response.data.message, classes: 'red'})
      }
    }  
  }
  
  return(
    <div className='card create-post-container input-field'>
      <input type='text' placeholder='title' value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input type='text' placeholder='body' value={body} onChange={(e)=>setBody(e.target.value)} />
      <div className='file-field input-field'>
        <div className='btn waves-effect waves-light blue'>
          <span>File</span>
          <input type='file' onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className='file-path-wrapper'>
          <input className='file-path validate' type='text' />
        </div>
      </div>
      <button className='btn waves-effect waves-light blue' onClick={postDetails}>
        Submit
      </button>
    </div>
  )
}

export default CreatePost