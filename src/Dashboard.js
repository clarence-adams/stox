import './Dashboard.css'
import {useState, useEffect} from 'react'
import {slide as Menu} from 'react-burger-menu'
import Overview from './Overview.js'
import History from './History.js'
import Quote from './Quote.js'
import Buy from './Buy.js'
import Sell from './Sell.js'

function Dashboard(props) {
  
  const [cash, setCash] = useState()
  const [content, setContent] = useState('overview')
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    props.updateUserData()
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth)
    })

  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (props.user.cash !== undefined) {
      let cash = parseFloat(props.user.cash.toFixed(2)).toLocaleString()
      setCash('$' + cash)
    } else {
      setCash('$' + 0 + '.' + 0 + 0)
    }
  }, [props.user])

  const logout = () => {
    const options = {
      method: 'GET',
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    }
    fetch('/.netlify/functions/logout', options)
    .then(() => document.cookie = 'authenticated=false')
    .catch(err => console.error(err))
    .finally(() => props.setUser({}))
  }

  const MobileNavbar = () => {
    if (windowWidth <= 900) {
      return (
        <>
          <Menu>
            <div id='menu'>
              <div id='dashboard'>
                <Overview user={props.user} cash={cash}/>
              </div>
              <nav id='navbar'>
                <button className='navbar-button' onClick={() => setContent('overview')}>Overview</button>
                <button className='navbar-button' onClick={() => setContent('quote')}>Quote</button>
                <button className='navbar-button' onClick={() => setContent('buy')}>Buy</button>
                <button className='navbar-button' onClick={() => setContent('sell')}>Sell</button>
              </nav>
            </div>
          </Menu>
        </>
      )
    } else {
      return <></>
    }
  }

  const Navbar = () => {
    if (windowWidth >= 900) {
      return (
        <>
          <div id='dashboard'>
            <Overview user={props.user} cash={cash}/>
          </div>
          <nav id='navbar'>
            <button className='navbar-button' onClick={() => setContent('overview')}>Overview</button>
            <button className='navbar-button' onClick={() => setContent('quote')}>Quote</button>
            <button className='navbar-button' onClick={() => setContent('buy')}>Buy</button>
            <button className='navbar-button' onClick={() => setContent('sell')}>Sell</button>
          </nav>
        </>
      )
    } else {
      return <></>
    }
  }

  return (
    <div id='dashboard'>
      <MobileNavbar id='menu'/>
    <header id='dashboard-header'>
      <h1 id='dashboard-h1'>StoX</h1>
      <div id='header-navbar'>
        <button id='logout-button' className='anchor-button header-navbar-button' type='button' onClick={logout}>Logout</button>
      </div>
    </header>
    <div id='dashboard-content'>
      <Navbar/>
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