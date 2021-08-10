import './Landing.css'
import {Link} from 'react-router-dom'

function Landing(props) {
  return (
    <div id='landing' class='main-wrapper'>
    <header>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='registration-form' action='/register' method='post'>
        <div className='form-group'>
          <h2>Register</h2>
          <div className='first-form-element'>
            <div className='form-label-wrapper'>
            <label htmlFor='username'>Username<span className='red-asterisk'> *</span></label>
            </div>
            <input name='username' id='registration-username' className='registration-input' type='text' required='true' onInput='checkUsernameAvailability()'/>
          </div>
          <p id='username-alert' className='validation-message'></p>
          <div className='form-element'>
            <label htmlFor='password'>Password<span className='red-asterisk'> *</span></label>
            <input name='password' id='registration-password' type='password' required='true'/>
          </div>
          <div className='form-element'>
            <label htmlFor='password-confirmation'>Confirm Password<span className='red-asterisk'> *</span></label>
            <input name='password-confirmation' id='registration-password-confirmation' type='password' required='true' onBlur='validateForm()'/>
          </div>
          <div id='security-question-wrapper' className='form-element'>
            <div className='double-input-wrapper'>
              <div>
                <label htmlFor='security question'>Security Question<span className='red-asterisk'> *</span></label>
                <select name='security-question' id='security-question' required='true'>
                  <option value='color'>What's your favorite color?</option>
                  <option value='food'>What's your favorite food?</option>
                  <option value='animal'>What's your favorite animal?</option>
                </select>
              </div>
              <div>
                <label htmlFor='security question answer'>Answer<span className='red-asterisk'> *</span></label>
                <input name='security-question-answer' id='security-question-answer' type='text' required='true'/>
              </div>
            </div>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' type='checkbox' onClick='showPassword()'/>
              <label htmlFor='show password'>Show Password</label>
            </div>
          </div>
          <p id='form-alert' className='validation-message'></p>
          <div className='primary-form-actions'>
            <button id='registration-form-button' type='submit'>Start Trading!</button>
            <Link to='/authentication' className='secondary-button'>Log In</Link>
          </div>
        </div>
      </form>
    </div>
    <p className='warning-text'>Do not enter any important passwords that you already use for your email or bank. There is very little security in this application!</p>
    </div>
  )
}

export default Landing