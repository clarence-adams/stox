import {Link} from 'react-router-dom'
import './theme.css'

function ResetPassword() {
  return (
    <div id='reset-password' class='main-wrapper'>
    <header>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='password-reset-form' action='/reset-password' method='POST' onsubmit='resetPassword(this, event)'>
        <div className='form-group'>
          <h2>Reset Password</h2>
          <div className='first-form-element'>
            <label for='username'>Username<span className='red-asterisk'> *</span></label>
            <input name='username' id='username' type='text' required='true' onBlur='getUsername()'/>
          </div>
          <div className='form-element'>
            <p id='security-question'></p>
          </div>
          <div className='form-element'>
            <label for='security-question-answer'>Answer<span className='red-asterisk'> *</span></label>
            <input name='security-question-answer' type='text' required='true'/>
          </div>
          <div className='form-element'>
            <label for='password'>New Password<span className='red-asterisk'> *</span></label>
            <input name='password' id='reset-password' type='password' required='true'/>
          </div>
          <div className='form-element'>
            <label for='password-confirmation'>Confirm New Password<span className='red-asterisk'> *</span></label>
            <input name='password-confirmation' id='reset-password-confirmation' type='password' required='true' onBlur='validateForm()'/>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' type='checkbox' onClick='showPassword()'/>
              <label for='show password'>Show Password</label>
            </div>
          </div>
          <p id='form-alert'></p>
          <div className='primary-form-actions'>
            <button id='reset-password-form-button' type='submit'>Reset Password</button>
            <Link to='/authentication' className='secondary-button'>Log In</Link>
          </div>
        </div>
      </form>
    </div>
    <p className='warning-text'>Do not enter any important passwords that you already use for your email or bank. There is very little security in this application!</p>
    </div>
  )
}

export default ResetPassword