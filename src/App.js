import './App.css'
import {useState, useEffect} from 'react'
import Overview from './Overview.js'
import History from './History.js'
import Quote from './Quote.js'
import Buy from './Buy.js'
import Sell from './Sell.js'

function App() {
  const [user, setUser] = useState({})
  const [cash, setCash] = useState()
  const [content, setContent] = useState('overview')

  const updateUserData = async () => {
    const userData = await fetchUserData()
    setUser(userData)
  }

  useEffect(() => {
    updateUserData()
  }, [])

  useEffect(() => {
    if (user.cash !== undefined) {
      let cash = parseFloat(user.cash.toFixed(2)).toLocaleString()
      setCash('$' + cash)
    }
  }, [user])


  return (
    <div id='App'>
      <header>
        <h1>StoX</h1>
        <div id='header-navbar'>
          <a id='logout-button' className='anchor-button header-navbar-button'href='/dashboard/logout'>Logout</a>
        </div>
      </header>
      <div id='content'>
        <div id='navbar'>
          <button className='navbar-button' onClick={() => setContent('overview')}>Overview</button>
          <button className='navbar-button' onClick={() => setContent('quote')}>Quote</button>
          <button className='navbar-button' onClick={() => setContent('buy')}>Buy</button>
          <button className='navbar-button' onClick={() => setContent('sell')}>Sell</button>
        </div>
        <div id='dashboard'>
          <Overview user={user} cash={cash}/>
        </div>
        <div id='buy-sell-forms'>
        {(() => {
          switch (content) {
            case 'overview': 
              return <div><History purchases={user.purchases} sales={user.sales}/></div>
            case 'quote':
              return <div><Quote parentCallback={updateUserData}/></div>
            case 'buy': 
              return <div><Buy parentCallback={updateUserData}/></div>
            case 'sell':
              return <div><Sell parentCallback={updateUserData}/></div>
            default: return null
          }
        })()}
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

// future function for fetching a stock quote so a total can be calculated before
// a buy or sell transaction is made

//const fetchStockQuote = (symbol) => {
//  const data = {symbol}
//  const requestOptions = {
//    method: 'POST',
//    headers: {'Content-Type': 'application/json'},
//    body: JSON.stringify(data)
//  }
//
//  let quote = fetch('/dashboard/quote', requestOptions)
//  .then(res => res.json())
//  .then(res => quote = (res.quote.toFixed(2)))
//  .catch((err) => console.error('error fetching stock quote: ' + err))
//
//  return quote
//}

export default App
