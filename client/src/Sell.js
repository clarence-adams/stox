import './Sell.css'
import {useState} from 'react'

function Sell(props) {
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState(0)

  const symbolChangeHandler = (event) => setSymbol(event.target.value.toUpperCase())
  const sharesChangeHandler = (event) => setShares(event.target.value)

  const clickHandler = () => { 
    const data = {symbol, shares}
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }

    fetch('/dashboard/sell', requestOptions)
    .then(() => props.parentCallback())
    .catch((err) => console.error('error completing sale: ' + err))
  }

  return (
    <div id='sell-wrapper'>
      <form id='sell-form'>
        <label htmlFor='Symbol'>Symbol</label>
        <input type='text' id='symbol' onChange={symbolChangeHandler} value={symbol}/>
        <label htmlFor='Shares'>Shares</label>
        <input type='text' id='shares' onChange={sharesChangeHandler} value={shares}/>
      </form>
      <button type='submit' onClick={clickHandler}>Sell</button>
    </div>
  )
}

export default Sell