import './App.css';
import {useState, useEffect} from 'react'
import Quote from './Quote.js'

function App() {
  const [user, setUser] = useState({})

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {"Content-Type": "application/json"}
    }

    fetch('/dashboard/user', requestOptions)
    .then(res => res.json())
    .then(res => {
      setUser(res)
    })
    .catch(() => {
      setUser('error')
    })
  }, [])

  const logout = () => {
     const requestOptions = {
      method: "GET",
      headers: {"Content-Type": "application/json"},
      redirect: 'follow'
    }

    fetch('/dashboard/logout', requestOptions)
    .catch(() => {
      console.log('logout error')
    })
  }

  return (
    <div className="App">
      <div id='navbar'>
        <button id='logout-button' onClick={logout}>Logout</button>
      </div>
      <h1>Hello, {user.username}</h1>
      <h2>Cash on hand: {user.cash}</h2>
      <Quote/>
    </div>
  );
}

export default App;
