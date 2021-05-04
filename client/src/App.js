import React, {useEffect, createContext, useReducer, useContext} from 'react'
import './App.css';
import './materialize/css/materialize.min.css'
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import UserProfile from './components/screens/UserProfile'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import Feed from './components/screens/Feed'
import {reducer, initialState} from './reducers/userReducer'
export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type: "USER", payload: user})
    } else {
      history.push('/login')
    }
  }, [])
  return(
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/feed">
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