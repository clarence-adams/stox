import {useState} from 'react'
import fetchStockQuote from './helpers.js'

const Quote = () => {
  const [symbol, setCurrentSymbol] = useState('')
  const [currentQuote, setCurrentQuote] = useState('')

  const changeHandler = (event) => setCurrentSymbol(event.target.value.toUpperCase())

  const clickHandler = async () => {
    const quote = await fetchStockQuote(symbol)
    setCurrentQuote(quote)
  }

  return (
    <div className='dashboard-form-wrapper'>
      <form className='component-form'>
        <div className='form-element'>
          <label htmlFor='symbol' className='component-label'>Symbol</label>
          <input className='component-input' type='text' id='symbol' onChange={changeHandler} value={symbol}/>
        </div>
      </form>
      <button className='primary-button' type='submit' onClick={clickHandler}>Get Quote</button>
      <p id='quote'>{currentQuote}</p>
    </div>
  )
}

export default Quote
