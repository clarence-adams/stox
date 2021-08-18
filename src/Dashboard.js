import './Dashboard.css'
import {useState, useEffect} from 'react'
import Overview from './Overview.js'
import History from './History.js'
import Quote from './Quote.js'
import Buy from './Buy.js'
import Sell from './Sell.js'

function Dashboard(props) {
  const [cash, setCash] = useState()
  const [content, setContent] = useState('overview')

  useEffect(() => {
    if (props.user.cash !== undefined) {
      let cash = parseFloat(props.user.cash.toFixed(2)).toLocaleString()
      setCash('$' + cash)
    } else {
      setCash('$' + 0 + '.' + 0 + 0)
    }
  }, [props.user])

  return (
    <div id='dashboard'>
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
        <Overview user={props.user} cash={cash}/>
      </div>
      <div id='buy-sell-forms'>
      {(() => {
        switch (content) {
          case 'overview': 
            return <div><History purchases={props.user.purchases} sales={props.user.sales}/></div>
          case 'quote':
            return <div><Quote parentCallback={props.updateUserData}/></div>
          case 'buy': 
            return <div><Buy parentCallback={props.updateUserData}/></div>
          case 'sell':
            return <div><Sell parentCallback={props.updateUserData}/></div>
          default: return null
        }
      })()}
      </div>
    </div>
    </div>
  )
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

export default Dashboard