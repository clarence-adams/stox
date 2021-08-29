import {useState} from 'react'

function Buy(props) {
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState('')
  const [alert, setAlert] = useState('')

  const digitsRegex = /^[1-9][0-9]*$|^$/
  const symbolChangeHandler = (event) => setSymbol(event.target.value.toUpperCase())
  const sharesChangeHandler = (event) => 
  {
    if (digitsRegex.test(event.target.value)) {
      setShares(event.target.value)
      document.getElementById('buy-button').disabled = false
      setAlert('')
    } else {
      document.getElementById('buy-button').disabled = true
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

    fetch('.netlify/functions/buy-stock', requestOptions)
    .then(res => res.json())
    .then(res => {
      console.log(res)
      switch (res.error) {
        case 'user needs more cash': setAlert('You need more cash!'); break
        case '0 shares': setAlert('You need to purchase at least 1 share!'); break
        case 'blank shares': setAlert('You must enter an amount of shares!'); break
        case 'invalid symbol': setAlert('Invalid symbol'); break
        case 'average is null': setAlert('Error completing transaction. Try again later.'); break
        case 'successful': 
          props.parentCallback()
          setAlert('Transaction Successful!')
          break
        default: setAlert('Something went wrong. Try again later')
      }
    })
    .catch((err) => console.error('error completing purchase: ' + err))
  }

  return (
    <div className='dashboard-form-wrapper'>
      <form className='component-form'>
        <div className='form-element'>
          <label htmlFor='symbol' className='component-label'>Symbol</label>
          <input className='component-input' type='text' id='symbol' onInput={symbolChangeHandler} value={symbol}/>
        </div>
        <div className='form-element'>
          <label htmlFor='shares' className='component-label'>Shares</label>
          <input className='component-input' type='text' id='shares' onInput={sharesChangeHandler} value={shares}/>
        </div>
      </form>
      <button className='primary-button' id='buy-button' type='button' onClick={clickHandler}>Buy</button>
      <p className='form-alert'>{alert}</p>
    </div>
  )
}

export default Buy