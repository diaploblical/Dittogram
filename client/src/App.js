/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';
import './materialize/css/materialize.min.css'
import React, {useEffect, createContext, useReducer, useContext} from 'react'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import {reducer, initialState} from './reducers/userReducer'
import Navbar from './components/Navbar'
import Home from './components/views/Home'
import Profile from './components/views/Profile'
import UserProfile from './components/views/UserProfile'
import Login from './components/views/Login'
import Signup from './components/views/Signup'
import CreatePost from './components/views/CreatePost'
import Feed from './components/views/Feed'
export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      dispatch({type: 'USER', payload: user})
    } else {
      history.push('/login')
    }
  }, [])
  return(
    <Switch>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route path='/login'>
        <Login />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/createpost'>
        <CreatePost />
      </Route>
      <Route path='/feed'>
        <Feed />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;