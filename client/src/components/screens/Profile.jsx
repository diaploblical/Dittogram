import React from 'react'
import mahoro from '../../assets/images/robot.jpg'

const Profile = () => {
  return(
    <div className="custom-container">
      <div className="profile">
          <div>
            <img className="avatar" src={mahoro} alt="robot" />
          </div>
          <div>
            <h4>LOGE</h4>
            <div className="postFollowContainer">
              <h5>L</h5>
              <h5>A</h5>
              <h5>G</h5>
            </div>
          </div>
      </div>
      <div className="gallery">
        
      </div>
    </div>
  )
}

export default Profile