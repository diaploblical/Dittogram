import React, {useState} from 'react'
import axios from 'axios'

const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const postDetails = async () => {
    const formData = new FormData()
    formData.append("file", image, image.name)
    
    await axios.post("/imageupload", formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }).then(console.log('shit worked god'))
    .catch(error => {
      console.log(error)
    })
  }
  return(
    <div className="card create-post-container input-field">
      <input type="text" placeholder="title" value={title} onChange={(e)=>setTitle(e.target.value)} />
      <input type="text" placeholder="body" value={body} onChange={(e)=>setBody(e.target.value)} />
      <div className="file-field input-field">
        <div className="btn waves-effect waves-light blue">
          <span>File</span>
          <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button className="btn waves-effect waves-light blue" onClick={postDetails}>
        Submit
      </button>
    </div>
  )
}

export default CreatePost