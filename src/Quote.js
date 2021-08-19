import './Quote.css'
import {useState} from 'react'

function Quote() {
  const [symbol, setCurrentSymbol] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')
  const [alert, setAlert] = useState('')

  const changeHandler = (event) => setCurrentSymbol(event.target.value.toUpperCase())

  const data = {symbol}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const clickHandler = () => {
    fetch('.netlify/functions/get-quote', requestOptions)
    .then(res => res.json())
    .then(res => {
      if (res.error === 'invalid symbol') {
        setAlert('Invalid symbol')
        setCurrentQuote('')
      } else if (res.error === 'average is null') {
        setAlert('Error fetching price, try again later')
      } else {
        setAlert('')
        setCurrentQuote('$' + res.quote.toFixed(2))
      }
    })
    .catch((err) => {
      setCurrentQuote('error')
      console.log(err)
    })
  }

  return (
    <div className='form-wrapper'>
      <form>
        <label htmlFor='quote'>Symbol</label>
        <input type='text' id='symbol' onChange={changeHandler} value={symbol}/>
      </form>
      <p id='quote'>{currentQuote}</p>
      <button className='primary-button' type='submit' onClick={clickHandler}>Get Quote</button>
      <p className='form-alert'>{alert}</p>
    </div>
  )
}

export default Quote
