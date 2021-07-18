import './Buy.css';
import {useState} from 'react'

function Buy(props) {
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

    fetch('/dashboard/buy', requestOptions)
    .then(() => props.parentCallback())
    .catch((err) => console.error('error completing sale: ' + err))
  }

  return (
    <div id='buy-wrapper'>
      <label htmlFor='Symbol'>Symbol</label>
      <input type='text' id='symbol' onChange={symbolChangeHandler} value={symbol}/>
      <label htmlFor='Shares'>Shares</label>
      <input type='text' id='shares' onChange={sharesChangeHandler} value={shares}/>
      <button type='submit' onClick={clickHandler}>Buy</button>
    </div>
  )
}

export default Buy;