import './theme.css'
// import {useState} from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import Landing from './Landing.js'
import Authentication from './Authentication.js'
import ResetPassword from './ResetPassword.js'
import Dashboard from './Dashboard.js'

function App() {
  // const [authenticated, setAuthenticated] = useState(false)

  return (
    <Router>
    <Switch>
    <div id='App'>
      <Route path='/' exact component={Landing}/>
      <Route path='/authentication' component={Authentication}/>
      <Route path='/reset-password' component={ResetPassword}/>
      <Route path='/Dashboard' component={Dashboard}/>
    </div>
    </Switch>
    </Router>
  )
}

export default App
