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