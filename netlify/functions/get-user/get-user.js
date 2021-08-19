const {createClient} = require('@astrajs/collections')
const jwt = require('jsonwebtoken')

require('dotenv').config()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  let verifiedToken

  // ensure user is authenticated
  try {
    const accessToken = event.headers.cookie.split('=')[1]
    verifiedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
  } catch(err) {
    return {statusCode: 401}
  }

  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
  })
  
  // create a shortcut to the users collection in the app namespace/keyspace
  // collections are created automatically
  const usersCollection = astraClient.namespace('Stox').collection('users')

  const userToGet = verifiedToken.username

  // find a single user
  const user = await usersCollection.findOne({username: {$eq: userToGet}})

  if (user === null) {
    return {statusCode: 500}
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({user: user})
    }
  }
}

module.exports = {handler}
