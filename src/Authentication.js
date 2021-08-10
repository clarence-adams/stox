import './theme.css'
import './Authentication.css'
import {Link} from 'react-router-dom'

function Authentication(props) {
  return (
    <div id='authentication' class='main-wrapper'>
    <header>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='login-form' action='/authenticate' method='POST' onsubmit='login(this, event)'>
        <div className='form-group'>
          <h2>Log In</h2>
          <div className='first-form-element'>
            <label htmlFor='username'>Username</label>
            <input name='username' type='text' required='true'/>
          </div>
          <div className='form-element'>
            <label htmlFor='password'>Password</label>
            <input name='password' id='authentication-password' type='password' required='true'/>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' type='checkbox' onClick='showPassword()'/>
              <label htmlFor='show password'>Show Password</label>
            </div>
            <Link to='/reset-password' id='forgot-password-link' className='tertiary-button'>Forgot Password?</Link>
          </div>
          <p id='form-alert'></p>
          <div className='primary-form-actions'>
            <button id='authentication-form-button' type='submit'>Log In</button>
            <Link to='/' className='secondary-button'>Register</Link>
          </div>
        </div>
      </form>
    </div>
    <p className='warning-text'>Do not enter any important passwords that you already use for your email or bank. There is very little security in this application!</p>
    </div>
  )
}

export default Authentication