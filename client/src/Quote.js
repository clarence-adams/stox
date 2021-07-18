import './Quote.css';
import {useState} from 'react'

function Quote() {
  const [symbol, setCurrentSymbol] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')

  const changeHandler = (event) => setCurrentSymbol(event.target.value.toUpperCase())

  const data = {symbol}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const clickHandler = () => {
    fetch('/dashboard/quote', requestOptions)
    .then(res => res.json())
    .then(res => setCurrentQuote('$' + res.quote.toFixed(2)))
    .catch(() => setCurrentQuote('error'))
  }

  return (
    <div id='quote-wrapper'>
      <label htmlFor='quote'/>
      <input type='text' id='symbol' onChange={changeHandler} value={symbol}/>
      <button type='submit' onClick={clickHandler}>Get Quote</button>
      <p>{currentQuote}</p>
    </div>
  )
}

export default Quote;
