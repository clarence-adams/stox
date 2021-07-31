getUsername = async () => {
  const username = document.getElementById('username').value

  const data = {username}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const userData = await fetch('/user', requestOptions)
  .then(res => res.json())
  .then (res => res)
  .catch(err => console.error(err))

  document.getElementById('security-question').innerHTML = 'What is your favorite ' + userData.securityQuestion + '?'
}

showPassword = () => {
  let input = document.getElementById('reset-password')
  let inputConfirmation = document.getElementById('reset-password-confirmation')

  input.type === 'password' ? input.type = 'text' : input.type = 'password'
  inputConfirmation.type === 'password' ? inputConfirmation.type = 'text' : inputConfirmation.type = 'password'
}

validateForm = () => {
  let input = document.getElementById('reset-password')
  let inputConfirmation = document.getElementById('reset-password-confirmation')
  let alert = document.getElementById('form-alert')
  let button = document.getElementById('reset-form-button')

  if (input.value !== inputConfirmation.value) {
    alert.innerHTML = 'Passwords must match'
    button.disabled = true
  } else {
    alert.innerHTML = 'Passwords match!'
    button.disabled = false
  }
}

resetPassword = (that, event) => {
  const form = that

  const username = form.username.value
  const answer = form['security-question-answer'].value
  const password = form.password.value
  let alert = document.getElementById('form-alert')

  const data = {username, answer, password}
  const requestOptions = {
    method: form.method,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    redirect: 'follow'
  }

  event.preventDefault()

  fetch(form.action, requestOptions)
  .then(res => res.json())
  .then(res => {
    if (res.error === 'incorrect security question answer') {
      alert.innerHTML = 'Incorrect security question answer'
    } else if (res.success) {
      window.location.href = res.redirectUrl;
    } 
  })
  .catch((err) => console.error('error changing password: ' + err))
}