import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {
  return(
    <nav>
      <div class="nav-wrapper">
        <Link to="/" class="brand-logo">Niggagram</Link>
        <ul id="nav-mobile" class="right">
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar