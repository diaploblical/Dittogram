import React, {useState} from 'react'
import axios from 'axios'
import M from 'materialize-css'


const CreatePost = () => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  
  const postDetails = async () => {
    const formData = new FormData()
    try {
      formData.append("file", image)
    } catch (error) {
      console.log(error)
      return
    }
    await axios.post("/imageupload", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': "Bearer " + localStorage.getItem("jwt"),
        'Filename': image.name
      }
    }).then(response => {
      console.log(response.status + " " + response.data.message)
      setUrl(response.data.url)
    }).then(
      await axios.post("/createpost", {title, body, url}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': "Bearer " + localStorage.getItem("jwt")
        }
      }).then(response => console.log(response.status + " " + response.statusText))
      .catch(error => {
        M.toast({html: error.response.data.message, classes: "red"})
        return
      })
    )
    .catch(error => {
      M.toast({html: error.response.data.message, classes: "red"})
      return
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