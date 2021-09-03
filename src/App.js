import './theme.css'
import {useState, useEffect} from 'react'
import {Redirect, BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Landing from './Landing.js'
import Authentication from './Authentication.js'
import ResetPassword from './ResetPassword.js'
import Dashboard from './Dashboard.js'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [user, setUser] = useState({})

  const updateUserData = async () => {
    const options = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    }

    const userData = await fetch('/.netlify/functions/get-user', options)
    .then(res => res.json())
    .then (res => res.user)
    .catch(err => console.error(err))

    if (userData !== null) {
      setUser(userData)
    }
  }

  // eslint-disable-next-line
  useEffect(() => {
    let authenticatedCookie
    try { 
      authenticatedCookie = JSON.parse(document.cookie.split('=')[1])
    } catch {}
    if (authenticatedCookie !== authenticated) {
      setAuthenticated(authenticatedCookie)
    }
  })

  return (
    <Router>
    <Switch>
    <div id='App'>
      <Route path='/' exact>
        {
          (authenticated === true)
          ? <Redirect from='/' to='/dashboard'/> 
          : <Landing setUser={setUser}/>
        }
      </Route>
      <Route path='/authentication'>
        {
          (authenticated === true)
          ? <Redirect from='/authentication' to='/dashboard'/>
          : <Authentication setUser={setUser}/>
        }
      </Route>
      <Route path='/reset-password' component={ResetPassword}/>
      <Route path='/dashboard'>
        {
          (authenticated === false)
          ? <Redirect from='/dashboard' to='/authentication'/>
          : <Dashboard user={user} setUser={setUser} updateUserData={updateUserData}/>
        }
      </Route>
    </div>
    </Switch>
    </Router>
  )
}

export default App
