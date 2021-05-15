import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
//import M from 'materialize-css'

const Navbar = () => {
  const {state, dispatch} = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <li key='profile'><Link to='/profile'>Profile</Link></li>,
        <li key='feed'><Link to='/feed'>Feed</Link></li>,
        <li key='createpost'><Link to='/createpost'>Create Post</Link></li>,
        <li key='logout'><Link to='/login' onClick={() => {localStorage.clear(); dispatch({type: 'CLEAR'})}}>Logout</Link></li>,
      ]
    } else {
      return [
        <li key='login'><Link to='/login'>Login</Link></li>,
        <li key='signup'><Link to='/signup'>Signup</Link></li>
      ]
    }
  }
  return(
    <nav>
      <div className='nav-wrapper blue'>
        <Link to={state ? '/' : '/login'} className='brand-logo'>notInstagram</Link>
        <a href='#' data-target='sidenav' className='sidenav-trigger'><i className="material-icons">menu</i></a>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          {renderList()}
        </ul>
      </div>
      <ul className='sidenav' id='sidenav'>
        <a href="">test</a>
      </ul>
    </nav>
    
  )
}

export default Navbar