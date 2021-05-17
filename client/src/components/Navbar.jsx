import React, {useContext} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const Navbar = () => {
  const {state, dispatch} = useContext(UserContext)
  const renderList = () => {
    if (state) {
      return [
        <li key='profile'><Link to='/profile' className='black-text'>Profile</Link></li>,
        <li key='feed'><Link to='/feed' className='black-text'>Feed</Link></li>,
        <li key='createpost'><Link to='/createpost' className='black-text'>Create Post</Link></li>,
        <li key='logout'><Link to='/login' className='black-text' onClick={() => {localStorage.clear(); dispatch({type: 'CLEAR'})}}>Logout</Link></li>,
      ]
    } else {
      return [
        <li key='login'><Link to='/login' className='black-text'>Login</Link></li>,
        <li key='signup'><Link to='/signup' className='black-text'>Signup</Link></li>
      ]
    }
  }
  document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  })
  return(
    <nav>
      <div className='nav-wrapper white'>
        <Link to={state ? '/' : '/login'} className='brand-logo black-text'>Dittogram</Link>
        <button data-target='sidenav' className='btn-flat sidenav-trigger hide-on-large-only'><i className='material-icons'>menu</i></button>
        <ul id='nav-mobile' className='right hide-on-med-and-down'>
          {renderList()}
        </ul>
      </div>
      <ul className='sidenav' id='sidenav'>
        {renderList()}
      </ul>
    </nav>
    
  )
}

export default Navbar