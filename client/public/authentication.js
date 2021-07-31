showPassword = () => {
  let input = document.getElementById('authentication-password')
  let inputConfirmation = document.getElementById('authentication-password-confirmation')

  input.type === 'password' ? input.type = 'text' : input.type = 'password'
  inputConfirmation.type === 'password' ? inputConfirmation.type = 'text' : inputConfirmation.type = 'password'
}

login = (that, event) => {
  const form = that

  const username = form.username.value
  const password = form.password.value
  let alert = document.getElementById('form-alert')

  const data = {username, password}
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
    if (res.authenticated) {
      window.location.href = res.redirectUrl;
    } else if (res.error === 'username does not exist') {
      alert.innerHTML = 'username does not exist'
    } else if (res.error === 'incorrect password') {
      alert.innerHTML = 'incorrect password'
    }
  })
  .catch((err) => console.error('error logging in: ' + err))
}