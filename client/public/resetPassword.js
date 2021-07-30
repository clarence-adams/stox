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