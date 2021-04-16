import React from 'react'
import mahoro from '../../assets/images/robot.jpg'
import kcco from '../../assets/images/k.png'

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
        <img className="item" src={kcco} alt="KCCO"/>
        <img className="item" src={kcco} alt="KCCO"/>
        <img className="item" src={kcco} alt="KCCO"/>
      </div>
    </div>
  )
}

export default Profile