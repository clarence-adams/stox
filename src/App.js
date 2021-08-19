import './theme.css'
import {useState, useEffect} from 'react'
import {Redirect, BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Landing from './Landing.js'
import Authentication from './Authentication.js'
import ResetPassword from './ResetPassword.js'
import Dashboard from './Dashboard.js'

function App() {
  const [user, setUser] = useState({})
  const [authenticated, setAuthenticated] = useState(false)

  const updateUserData = async () => {
    const userData = await fetchUserData()

    if (userData !== null) {
      setUser(userData)
    }
  }

  useEffect(() => {
    updateUserData()
  }, [])

  return (
    <Router>
    <Switch>
    <div id='App'>
      <Route path='/' exact>
        {authenticated 
        ? <Redirect to='/dashboard'/> 
        : <Landing setAuthenticated={setAuthenticated} setUser={setUser}/>}
      </Route>
      <Route path='/authentication'>
        {authenticated
        ? <Redirect to='/dashboard'/>
        : <Authentication setAuthenticated={setAuthenticated} setUser={setUser}/>}
      </Route>
      <Route path='/reset-password' component={ResetPassword}/>
      <Route path='/dashboard'>
        <Dashboard authenticated={authenticated} user={user} setUser={setUser} updateUserData={updateUserData}/>
      </Route>
    </div>
    </Switch>
    </Router>
  )
}

const fetchUserData = () => {
  const options = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }

  const userData = fetch('/.netlify/functions/get-user', options)
  .then(res => res.json())
  .then (res => res.user)
  .catch(err => console.error(err))

  console.log(userData)
  return userData
}

export default App
