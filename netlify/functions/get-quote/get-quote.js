const jwt = require('jsonwebtoken')
const got = require('got')

require('dotenv').config()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  // ensure user is authenticated
  try {
    const accessToken = event.headers.cookie.split('=')[1]
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
  } catch(err) {
    return {statusCode: 401}
  }

  const symbol = JSON.parse(event.body).symbol

  // fetch stock info
  const quote = await got(
    'https://cloud.iexapis.com/stable/stock/' 
    + symbol 
    + '/intraday-prices?token=' 
    + process.env.API_KEY 
    + '&chartLast=1'
  ).json()
  .catch(err => {
    return {
      statusCode: 200,
      body: JSON.stringify({error: err})
    }
  })

  if (quote[0] === undefined) {
    return {
      statusCode: 200,
      body: JSON.stringify({error: 'invalid symbol'})
    }
  } else if (quote[0].average === null) {
    return {
      statusCode: 200,
      body: JSON.stringify({error: 'average is null'})
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({quote: quote[0].average})
    }
  }
}

module.exports = {handler}