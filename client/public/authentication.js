showPassword = () => {
  let input = document.getElementById('authentication-password')
  let inputConfirmation = document.getElementById('authentication-password-confirmation')

  input.type === 'password' ? input.type = 'text' : input.type = 'password'
  inputConfirmation.type === 'password' ? inputConfirmation.type = 'text' : inputConfirmation.type = 'password'
}