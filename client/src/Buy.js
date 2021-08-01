import './Buy.css'
import {useState} from 'react'

function Buy(props) {
  const [symbol, setSymbol] = useState('')
  const [shares, setShares] = useState(0)
  const [alert, setAlert] = useState('')

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
    .then(res => res.json())
    .then(res => {
      if (res.error === 'user needs more cash') {
        setAlert('You need more cash!')
      } else if (res.error === '0 shares') {
        setAlert('You need to purcase at least 1 share')
      } else if (res.error === 'invalid symbol') {
        setAlert('Invalid symbol')
      } else if (res.transaction === 'successful') {
        props.parentCallback()
        setAlert('Purchase successful!')
      }
    })
    .catch((err) => console.error('error completing purchase: ' + err))
  }

  return (
    <div className='form-wrapper'>
      <form>
        <label htmlFor='Symbol'>Symbol</label>
        <input type='text' id='symbol' onChange={symbolChangeHandler} value={symbol}/>
        <label htmlFor='Shares'>Shares</label>
        <input type='number' id='shares' onChange={sharesChangeHandler} value={shares}/>
      </form>
      <button className='primary-button' type='button' onClick={clickHandler}>Buy</button>
      <p className='form-alert'>{alert}</p>
    </div>
  )
}

export default Buy