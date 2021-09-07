import './theme.css'
import {useState} from 'react'
import {Link} from 'react-router-dom'

const ResetPassword = () => {

  const [username, setUsername] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('')
  const [securityQuestionAnswer, setSecurityQuestionAnswer] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [alert, setAlert] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const usernameOnInput = (event) => setUsername(event.target.value)
  const securityQuestionAnswerOnInput = (event) => setSecurityQuestionAnswer(event.target.value)
  const passwordOnInput = (event) => setPassword(event.target.value)
  const passwordConfirmationOnInput = (event) => setPasswordConfirmation(event.target.value)

  // fetches users security question from database and displays it
  const getSecurityQuestion = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({username: username})
    }
    fetch('.netlify/functions/get-security-question', options)
    .then(res => res.json())
    .then(res => {
      if (res.securityQuestion !== null) {
        setSecurityQuestion(res.securityQuestion)
      } else {
        setSecurityQuestion('Could not fetch security question')
      }
    })
    .catch(err => {
      console.error(err)
      setSecurityQuestion('Could not fetch security question')
    })
  }

  // ensures users security question answer is correct and then updates password
  const resetPassword = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({username: username, password: password, securityQuestionAnswer: securityQuestionAnswer})
    }
    fetch('.netlify/functions/reset-password', options)
    .then(res => res.json())
    .then(res => {
      if (res.success === 'password reset') {
        setAlert('password successfully reset!')
        setButtonDisabled(true)
      } else {
        setAlert('error resetting password')
        setButtonDisabled(true)
      }
    })
    .catch(err => console.error(err))
  }

  const validateForm = () => {
    if (password !== passwordConfirmation) {
      setAlert('Passwords must match')
      setButtonDisabled(true)
    } else {
      setAlert('Passwords match!')
      setButtonDisabled(false)
    }
  }

  const showPassword = () => {
    passwordInputType === 'password' 
    ? setPasswordInputType('text') 
    : setPasswordInputType('password')   
  }

  return (
    <div id='reset-password' class='main-wrapper'>
    <header>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='password-reset-form'>
        <div className='form-group'>
          <h2>Reset Password</h2>
          <div className='first-form-element'>
            <label for='username'>Username<span className='red-asterisk'> *</span></label>
            <input name='username' id='username' type='text' required={true} onInput={usernameOnInput} onBlur={getSecurityQuestion}/>
          </div>
          <div className='form-element'>
            <p id='security-question'>{securityQuestion}</p>
          </div>
          <div className='form-element'>
            <label for='security-question-answer'>Answer<span className='red-asterisk'> *</span></label>
            <input name='security-question-answer' type='text' value={securityQuestionAnswer} onInput={securityQuestionAnswerOnInput} required={true}/>
          </div>
          <div className='form-element'>
            <label for='password'>New Password<span className='red-asterisk'> *</span></label>
            <input name='password' id='reset-password' type={passwordInputType} value={password} onInput={passwordOnInput} required={true}/>
          </div>
          <div className='form-element'>
            <label for='password-confirmation'>Confirm New Password<span className='red-asterisk'> *</span></label>
            <input name='password-confirmation' id='reset-password-confirmation' type={passwordInputType} value={passwordConfirmation} onInput={passwordConfirmationOnInput} required={true} onBlur={validateForm}/>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' type='checkbox' onClick={showPassword}/>
              <label for='show password'>Show Password</label>
            </div>
          </div>
          <p id='form-alert'>{alert}</p>
          <div className='primary-form-actions'>
            <button id='reset-password-form-button' disabled={buttonDisabled} type='button' onClick={resetPassword}>Reset Password</button>
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