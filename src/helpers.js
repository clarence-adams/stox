const fetchStockQuote = async (symbol) => {
  const data = {symbol}
  const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }

  const quote = await fetch('.netlify/functions/get-quote', requestOptions)
  .then(res => res.json())
  .then(res => {
    switch(res.error) {
      case 'invalid symbol':
        return 'Invalid symbol'
      case 'average is null':
        return 'Error fetching price, try again later'
      default:
        return '$' + res.quote.toFixed(2)
    }
  })
  .catch(err => {
    return 'error'
  })

  console.log(quote)

  return quote
}

export default fetchStockQuote