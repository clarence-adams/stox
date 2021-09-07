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
    return {statusCode: 400, body: JSON.stringify({error: 'blank shares'})}
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
    } else if (quote[0].average === null || quote[0].average === 0) {
      return {statusCode: 200, body: JSON.stringify({error: 'average is null'})}
    } else {
      const shareValue = quote[0].average
      const orderTotal = shareValue * shares

      const isSymbol = (string, symbol) => {
        if (string === symbol) {
          return true
        }
      }

      let newUserPositions = [...user.positions]
      const currentPosition = newUserPositions.find((element) => isSymbol(element.symbol, JSON.parse(event.body).symbol))

      if (currentPosition === undefined) {
        return {statusCode: 200, body: JSON.stringify({error: 'position does not exist'})}
      } else if (currentPosition.shares < shares) {
        return {statusCode: 200, body: JSON.stringify({error: 'user needs more shares'})}
      } else {
        // records new transaction in user sales
        let newUserCash = user.cash + orderTotal
        let newUserSales = [...user.sales]

        // configures current date and time of transaction

        const date = new Date(Date.now())

        const month = parseInt(date.getMonth()) + 1
        const day = date.getDate()
        const year = date.getFullYear()
        let amOrPm = ''
        const hour = (() => {
          let formattedHours = date.getHours()
          if (formattedHours > 12) {
            amOrPm = 'pm'
            return formattedHours - 12
          }
          amOrPm = 'am'
          return formattedHours
        })()
        const minutes = date.getMinutes()

        const formattedDate = month + '/' + day + '/' + year + ' ' + hour + ':' + minutes + amOrPm
        
        newUserSales.push({
          symbol: JSON.parse(event.body).symbol, 
          shares: shares, 
          shareValue: shareValue, 
          date: formattedDate
        })
        const currentPositionIndex = newUserPositions.findIndex((element) => isSymbol(element.symbol, JSON.parse(event.body).symbol))
        // if user is selling all of their available shares the position is removed from their portfolio
        if (currentPosition.shares === shares) {
          newUserPositions.splice(currentPositionIndex, 1)
        // if user is not selling all of their available shares updates the current position
        } else {
          newUserPositions[currentPositionIndex].shares = currentPosition.shares - shares
        }

        await usersCollection.update(userToFind, {
          cash: newUserCash,
          positions: newUserPositions,
          sales: newUserSales
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