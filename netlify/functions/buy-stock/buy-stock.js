const {createClient} = require('@astrajs/collections')
const jwt = require('jsonwebtoken')
const got = require('got')

require('dotenv').config()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  let verifiedToken

  // ensure user is authenticated
  try {
    let accessToken = event.headers.cookie.split('=')[1]
    accessToken = accessToken.split(';')[0]
    verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
  } catch(err) {
    return {statusCode: 401}
  }

  const symbol = JSON.parse(event.body).symbol

  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
  })
  
  // create a shortcut to the users collection in the app namespace/keyspace
  // collections are created automatically
  const usersCollection = astraClient.namespace('Stox').collection('users')

  // find a single user
  const userToFind = verifiedToken.username
  const user = await usersCollection.findOne({username: {$eq: userToFind}})

  if (JSON.parse(event.body).shares === '') {
    res.status(401).json({error: 'blank shares'})
  } else {
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

      const shares = parseInt(JSON.parse(event.body).shares)

      if (quote[0] === undefined) {
        return {statusCode: 200, body: JSON.stringify({error: 'invalid symbol'})}
      } else if (shares === 0) {
        return {statusCode: 200, body: JSON.stringify({error: '0 shares'})}
      } else if (quote[0].average === null) {
        return {
          statusCode: 400,
          body: JSON.stringify({error: 'average is null'})
        }
      } else {
        const shareValue = quote[0].average
        const orderTotal = shareValue * shares

        if (user.cash < orderTotal) {
          return {
            statusCode: 400,
            body: JSON.stringify({error: 'user needs more cash'})
          }
        } else {
          // records new transaction in user purchases
          let newUserCash = user.cash - orderTotal
          let newUserPositions = [...user.positions]
          let newUserPurchases = [...user.purchases]
          
          newUserPurchases.push({
            symbol: JSON.parse(event.body).symbol, 
            shares: shares, 
            shareValue: shareValue, 
            date: new Date()
          })
          const isSymbol = (string, symbol) => {
            if (string === symbol) {
              return true
            }
          }
          const index = newUserPositions.findIndex((element) => isSymbol(element.symbol, JSON.parse(event.body).symbol))
          // if user does not already have a position in the stock a new position is created
          if (index === -1) {
            newUserPositions.push({
              symbol: JSON.parse(event.body).symbol,
              shares: shares,
              averageShareValue: shareValue
            })
          // if user does already have a position in the stock calculates a new average and adds shares to portfolio
          } else {
            const position = newUserPositions[index]
            const requestedShares = shares
            const newAverageShareValue = 
            ((position.shares * position.averageShareValue) 
            + (requestedShares * shareValue)) 
            / (position.shares + requestedShares)

            newUserPositions[index] = {
              symbol: JSON.parse(event.body).symbol,
              shares: position.shares + requestedShares,
              averageShareValue: newAverageShareValue
            }
          }

          await usersCollection.update(userToFind, {
            cash: newUserCash,
            positions: newUserPositions,
            purchases: newUserPurchases
          })

          return {
            statusCode: 200,
            body: JSON.stringify({error: 'successful'})
          }
        }
      }
    }
}

module.exports = {handler}