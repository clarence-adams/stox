checkUsernameAvailability = async () => {
  let username = document.getElementById('registration-username').value
  let alert = document.getElementById('username-alert')
  let button = document.getElementById('registration-form-button')
 
  const data = {username}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const isUsername = await fetch('/register/username', requestOptions)
  .then(res => res.json())
  .then(res => res)
  .catch((err) => console.error('error validating username: ' + err))

  if (isUsername.available) {
    alert.innerHTML = username + ' is available!'
    button.disabled = false
  } else {
    alert.innerHTML = username + ' is not available'
    button.disabled = true
  }
}

showPassword = () => {
  let input = document.getElementById('registration-password')
  let inputConfirmation = document.getElementById('registration-password-confirmation')

  input.type === 'password' ? input.type = 'text' : input.type = 'password'
  inputConfirmation.type === 'password' ? inputConfirmation.type = 'text' : inputConfirmation.type = 'password'
}

validateForm = () => {
  let input = document.getElementById('registration-password')
  let inputConfirmation = document.getElementById('registration-password-confirmation')
  let alert = document.getElementById('form-alert')
  let button = document.getElementById('registration-form-button')

  if (input.value !== inputConfirmation.value) {
    alert.innerHTML = 'Passwords must match'
    button.disabled = true
  } else {
    alert.innerHTML = 'Passwords match!'
    button.disabled = false
  }
}