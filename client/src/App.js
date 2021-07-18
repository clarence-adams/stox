import './App.css';
import {useState, useEffect} from 'react'
import Quote from './Quote.js'
import Buy from './Buy.js'
import Sell from './Sell.js'

function App() {
  const [user, setUser] = useState({})

  const updateUserData = async () => {
    const userData = await fetchUserData()
    setUser(userData)
  }

  useEffect(async () => {
    updateUserData()
  }, [])

  const logout = () => {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow'
    }

    fetch('/dashboard/logout', requestOptions)
    .catch((err) => console.log('logout error: ' + err))
  }

  return (
    <div className='App'>
      <div id='navbar'>
        <button id='logout-button' onClick={logout}>Logout</button>
      </div>
      <h1>Hello, {user.username}</h1>
      <h2>Cash on hand: {user.cash}</h2>
      <Quote/>
      <Buy parentCallback={updateUserData}/>
      <Sell parentCallback={updateUserData}/>
    </div>
  )
}

const fetchUserData = () => {
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'},
  }

  const userData = fetch('/dashboard/user', requestOptions)
  .then(res => res.json())
  .then (res => res)
  .catch(err => console.error(err))

  return userData
}

const fetchStockQuote = (symbol) => {
  const data = {symbol}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const quote = fetch('/dashboard/quote', requestOptions)
  .then(res => res.json())
  .then(res => quote = (res.quote.toFixed(2)))
  .catch((err) => console.error('error fetching stock quote: ' + err))

  return quote
}

export default App;
