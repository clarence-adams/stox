const {createClient} = require('@astrajs/collections')

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

  if (user.password !== password || user === null) {
    return {
      statusCode: 200,
      body: JSON.stringify({authenticated: false})
    }
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({authenticated: true})
    }
  }
}

module.exports = {handler}