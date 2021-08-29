import './Landing.css'
import {useState} from 'react'
import {Link} from 'react-router-dom'

function Landing(props) {

  const [username, setUsername] = useState('')
  const [usernameAlert, setUsernameAlert] = useState('')
  const [passwordInputType, setPasswordInputType] = useState('password')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [securityQuestion, setSecurityQuestion] = useState('What\'s your favorite color?')
  const [securityAnswer, setSecurityAnswer] = useState('')
  const [alert, setAlert] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(false)

  const usernameOnInput = (event) => setUsername(event.target.value)
  const passwordOnInput = (event) => setPassword(event.target.value)
  const passwordConfirmationOnInput = (event) => setPasswordConfirmation(event.target.value)
  const securityQuestionOnChange = (event) => setSecurityQuestion(event.target.value)
  const securityAnswerOnInput = (event) => setSecurityAnswer(event.target.value)

  const checkUsernameAvailability = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({username: username})
    }

    fetch('/.netlify/functions/check-username', options)
    .then(res => res.json())
    .then(res => {
      if (!res.available) {
        setUsernameAlert('Username is already taken')
        if (!buttonDisabled) setButtonDisabled(true)
      } else {
        setUsernameAlert('Username is available!')
        if (buttonDisabled) setButtonDisabled(false)
      }
    })
    .catch(() => {
      setUsernameAlert('Error checking username availability')
      setButtonDisabled(false)
    })
  }

  const createUser = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json; charset=utf-8'},
      body: JSON.stringify({
        username: username, 
        password: password, 
        securityQuestion: securityQuestion, 
        securityAnswer: securityAnswer})
    }

    fetch('/.netlify/functions/create-user', options)
    .then(res => res.json())
    .then(res => {
      if (res.status !== 200) {
        setAlert('Error registering. Try again later.')
        setButtonDisabled(true)
      }
    })
    .catch(err => {
      console.error(err)
    })
    .finally(async () => {
      const user = await fetch('/.netlify/functions/get-user', options)
        .then(res => res.json())
        .then (res => {
          return res.user
        })
        .catch(err => console.error(err))
        props.setUser(user)
        document.cookie = 'authenticated=true'
    })
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
    <div id='landing' className='main-wrapper'>
    <header id='landing-header'>
      <div id='welcome-message'>
        <h1>StoX</h1>
        <p>Trade fake stocks with fake money. It's fun!</p>
      </div>
    </header>
    <div className='form-wrapper'>
      <form id='registration-form'>
        <div className='form-group'>
          <h2>Register</h2>
          <div className='first-form-element'>
            <div className='form-label-wrapper'>
              <label htmlFor='registration-username'>Username<span className='red-asterisk'> *</span></label>
            </div>
            <input name='username' id='registration-username' className='registration-input' type='text' value={username} onInput={usernameOnInput} onBlur={checkUsernameAvailability} required={true}/>
          </div>
          <p id='username-alert' className='validation-message'>{usernameAlert}</p>
          <div className='form-element'>
            <div className='form-label-wrapper'>
              <label htmlFor='registration-password'>Password<span className='red-asterisk'> *</span></label>
            </div>
            <input name='password' id='registration-password' type={passwordInputType} value={password} onInput={passwordOnInput} required={true}/>
          </div>
          <div className='form-element'>
            <div className='form-label-wrapper'>
              <label htmlFor='registration-password-confirmation'>Confirm Password<span className='red-asterisk'> *</span></label>
            </div>
            <input name='password-confirmation' id='registration-password-confirmation' type={passwordInputType} value={passwordConfirmation} onInput={passwordConfirmationOnInput} onBlur={validateForm} required={true}/>
          </div>
          <div id='security-question-wrapper' className='form-element'>
            <div className='double-input-wrapper'>
              <div>
                <div className='form-label-wrapper'>
                  <label htmlFor='security-question'>Security Question<span className='red-asterisk'> *</span></label>
                </div>
                <select name='security-question' id='security-question' value={securityQuestion} onChange={securityQuestionOnChange} required={true}>
                  <option value='color'>What's your favorite color?</option>
                  <option value='food'>What's your favorite food?</option>
                  <option value='animal'>What's your favorite animal?</option>
                </select>
              </div>
              <div>
                <div className='form-label-wrapper'>
                  <label htmlFor='security-question-answer'>Answer<span className='red-asterisk'> *</span></label>
                </div>
                <input name='security-question-answer' id='security-question-answer' type='text' onInput={securityAnswerOnInput} required={true}/>
              </div>
            </div>
          </div>
          <div className='secondary-form-actions'>
            <div className='show-password-wrapper'>
              <input className='show-password-checkbox' id='show-password' type='checkbox' onClick={showPassword}/>
              <label htmlFor='show-password'>Show Password</label>
            </div>
          </div>
          <p id='form-alert' className='validation-message'>{alert}</p>
          <div className='primary-form-actions'>
            <button id='registration-form-button' type='button' disabled={buttonDisabled} onClick={createUser}>Start Trading!</button>
            <Link to='/authentication' className='secondary-button'>Log In</Link>
          </div>
        </div>
      </form>
    </div>
    <p className='warning-text'>Do not enter any important usernames/passwords that you already use for your email or bank. There is very little security in this application!</p>
    </div>
  )
}

export default Landing