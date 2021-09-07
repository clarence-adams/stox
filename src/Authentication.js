import './theme.css'
import './Authentication.css'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const Authentication = (props) => {
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [alert, setAlert] = useState('')

  const usernameOnInput = event => setUsername(event.target.value)
  const passwordOnInput = event => setPassword(event.target.value)

  const showPassword = () => {
    passwordInputType === 'password' 
    ? setPasswordInputType('text') 
    : setPasswordInputType('password')   
  }

  const authenticateUser = () => {
    let authenticated = false

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({username: username, password: password})
    }
    fetch('/.netlify/functions/authenticate-user', options)
    .then(res => res.json())
    .then(res => { 
      if (res.authenticated) {
        authenticated = true
      } else if (res.error === 'username does not exist') {
        setAlert('username does not exist')
      } else if (res.error === 'incorrect password') {
        setAlert('incorrect password')
      }
    })
    .catch(err => console.error(err))
    .finally(async () => {
      if (authenticated) {
        const user = await fetch('/.netlify/functions/get-user', options)
        .then(res => res.json())
        .then (res => {
          return res.user
        }) 
        props.setUser(user)
        document.cookie = 'authenticated=true'
      }
    })
  }

  return (
    <div id='authentication' className='main-wrapper'>
    <header id='authentication-header'>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='login-form'>
        <div className='form-group'>
          <h2>Log In</h2>
          <div className='first-form-element'>
            <div className='form-label-wrapper'>
              <label htmlFor='username'>Username</label>
            </div>
            <input name='username' type='text' onInput={usernameOnInput} required={true}/>
          </div>
          <div className='form-element'>
            <div className='form-element-wrapper'>
              <label htmlFor='password'>Password</label>
            </div>
            <input name='password' id='authentication-password' type={passwordInputType} onInput={passwordOnInput} required={true}/>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' id='show-password' type='checkbox' onClick={showPassword}/>
              <label htmlFor='show-password'>Show Password</label>
            </div>
            <Link to='/reset-password' id='forgot-password-link' className='tertiary-button'>Forgot Password?</Link>
          </div>
          <p id='form-alert'>{alert}</p>
          <div className='primary-form-actions'>
            <button className='primary-button' id='authentication-form-button' type='button' onClick={authenticateUser}>Log In</button>
            <Link to='/' className='secondary-button'>Register</Link>
          </div>
        </div>
      </form>
    </div>
    <p className='warning-text'>Do not enter any important usernames/passwords that you already use for your email or bank. There is very little security in this application!</p>
    </div>
  )
}

export default Authentication