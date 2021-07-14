import './App.css';
import {useState, useEffect} from 'react'
import Quote from './Quote.js'

function App() {
  const [user, setUser] = useState({})

  useEffect(() => {
    setUser(fetchUserData())
  }, [])

  //
  // TODO
  //

  const buy = (symbol) => {
    const quote = fetchStockQuote(symbol)


  }

  //
  //  TODO
  //

  const sell = (symbol) => {
    const quote = fetchStockQuote(symbol)
  }

  const logout = () => {
    const requestOptions = {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      redirect: 'follow'
    }

    fetch('/dashboard/logout', requestOptions)
    .catch(() => console.log('logout error'))
  }

  return (
    <div className='App'>
      <div id='navbar'>
        <button id='logout-button' onClick={logout}>Logout</button>
      </div>
      <h1>Hello, {user.username}</h1>
      <h2>Cash on hand: {user.cash}</h2>
      <Quote/>
    </div>
  );
}

const fetchUserData = () => {
  const userData
  const requestOptions = {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
  }

  fetch('/dashboard/user', requestOptions)
  .then(res => res.json())
  .then(res => userData = res)
  .catch(console.log('error fetching user data'))

  return userData
}

const fetchStockQuote = (symbol) => {
  const quote
  const data = {symbol}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  fetch('/dashboard/quote', requestOptions)
  .then(res => res.json())
  .then(res => quote = (res.quote.toFixed(2)))
  .catch(() => console.log('error fetching stock quote'))

  return quote
}

export default App;
