import './Sell.css'
import {useState} from 'react'

function Sell(props) {
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState(0)
  const [alert, setAlert] = useState('')

  const digitsRegex = /^[1-9][0-9]*$|^$/
  const symbolChangeHandler = (event) => setSymbol(event.target.value.toUpperCase())
  const sharesChangeHandler = (event) => 
  {
    if (digitsRegex.test(event.target.value)) {
      setShares(event.target.value)
      document.getElementById('sell-button').disabled = false
      setAlert('')
    } else {
      document.getElementById('sell-button').disabled = true
      setAlert('Shares must be a whole number')
    }
  }
  const clickHandler = () => { 
    const data = {symbol, shares}
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }

    fetch('/dashboard/sell', requestOptions)
    .then(res => res.json())
    .then(res => {
      switch (res.error) {
        case 'invalid symbol': setAlert('Invalid Symbol'); break
        case '0 shares': setAlert('You need to sell at least 1 share!'); break
        case 'blank shares': setAlert('You must enter an amount of shares!'); break
        case 'position does not exist': setAlert('You do not have a position in this stock!'); break
        case 'user needs more shares': setAlert('You need more shares!'); break
        case 'successful': 
          props.parentCallback()
          setAlert('Transaction Successful!')
      }
    })
    .catch((err) => console.error('error completing sale: ' + err))
  }

  return (
    <div className='form-wrapper'>
      <form>
        <label htmlFor='Symbol'>Symbol</label>
        <input type='text' id='symbol' onChange={symbolChangeHandler} value={symbol}/>
        <label htmlFor='Shares'>Shares</label>
        <input type='text' id='shares' onChange={sharesChangeHandler} value={shares}/>
      </form>
      <button className='primary-button' id='sell-button' type='button' onClick={clickHandler}>Sell</button>
      <p className='form-alert'>{alert}</p>
    </div>
  )
}

export default Sell