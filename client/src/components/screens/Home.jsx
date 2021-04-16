import React from 'react'
import mahoro from '../../assets/images/robot.jpg'
import kcco from '../../assets/images/k.png'

const Home = () => {
  return(
    <div className="custom-container">
      <div className="card home-card">
        <h5>User 1</h5>
        <div className="card-image">
          <img src={mahoro} alt="robot"/>
        </div>
        <div className="card-content">
          <i className="material-icons">favorite</i>
          <h4>g4</h4>
          <p>paragraph</p>
          <input type="text" placeholder="Add a comment"/>
        </div>
      </div>
      <div className="card home-card">
        <h5>User 1</h5>
        <div className="card-image">
          <img src={kcco} alt="robot"/>
        </div>
        <div className="card-content">
          <i className="material-icons">favorite</i>
          <h4>g4</h4>
          <p>paragraph</p>
          <input type="text" placeholder="Add a comment"/>
        </div>
      </div>
    </div>
  )
}

export default Home