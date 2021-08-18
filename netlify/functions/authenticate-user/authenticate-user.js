const {createClient} = require('@astrajs/collections')
const jwt = require('jsonwebtoken')

require('dotenv').config()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {

  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN
  })
  
  // create a shortcut to the users collection in the app namespace/keyspace
  // collections are created automatically
  const usersCollection = astraClient.namespace('Stox').collection('users')

  const username = JSON.parse(event.body).username
  const password = JSON.parse(event.body).password

  // find a single user
  const user = await usersCollection.findOne({username: {$eq: username}})

  if (user === null || user.password !== password) {
    return {
      statusCode: 200,
      body: JSON.stringify({authenticated: false})
    }
  } else {
    const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET)

    return {
      statusCode: 200,
      headers: {'Set-Cookie': ['accessToken=' + accessToken]},
      body: JSON.stringify({authenticated: true, accessToken: accessToken})
    }
  }
}

module.exports = {handler}