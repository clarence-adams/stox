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