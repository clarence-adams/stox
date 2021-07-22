import './Quote.css'
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
    <div class='form-wrapper'>
      <form>
        <label htmlFor='quote'/>
        <input type='text' id='symbol' onChange={changeHandler} value={symbol}/>
      </form>
      <p id='quote'>{currentQuote}</p>
      <button type='submit' onClick={clickHandler}>Get Quote</button>
    </div>
  )
}

export default Quote
