import React, {useState, useEffect} from 'react'
import axios from 'axios'
import M from 'materialize-css'

const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState('')
  const [photo, setPhoto] = useState('')
  
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
      } 
    }
    createPost()
  },[photo])

  const postDetails = async () => {
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
      M.toast({html: response.data.message, classes: 'green'})
      setPhoto(response.data.photo)
    } catch(error) {
      M.toast({html: error.response.data.message, classes: 'red'})
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