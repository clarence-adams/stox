import './App.css'
import {useState, useEffect} from 'react'
import Quote from './Quote.js'
import Buy from './Buy.js'
import Sell from './Sell.js'
import Positions from './Positions.js'

function App() {
  const [user, setUser] = useState({})
  const [cash, setCash] = useState()

  const updateUserData = async () => {
    const userData = await fetchUserData()
    setUser(userData)
  }

  useEffect(async () => {
    updateUserData()
  }, [])

  useEffect(() => {
    if (user.cash !== undefined) {
      setCash('$' + user.cash.toFixed(2))
    }
  }, [user])

  return (
    <div id='App'>
      <header>
        <h1>StoX</h1>
        <div id='navbar'>
          <a id='logout-button' className='anchor-button navbar-button'href='/dashboard/logout'>Logout</a>
        </div>
      </header>
      <div id='content'>
        <div id='dashboard'>
          <h2 id='welcome-text'>Hello, {user.username}</h2>
          <h3 id='cash'>{cash}</h3>
          <Positions positions={user.positions}/>
        </div>
        <div id='buy-sell-forms'>
          <Quote/>
          <Buy parentCallback={updateUserData}/>
          <Sell parentCallback={updateUserData}/>
        </div>
      </div>
    </div>
  )
}

const fetchUserData = () => {
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'}
  }

  const userData = fetch('/user', requestOptions)
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

export default App
