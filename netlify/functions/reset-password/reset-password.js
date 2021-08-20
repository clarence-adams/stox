const {createClient} = require('@astrajs/collections')
const {sha256} = require('crypto-hash')

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
  const password = sha256(JSON.parse(event.body).password)
  const securityQuestionAnswer = JSON.parse(event.body).securityQuestionAnswer

  // find a single user
  const user = await usersCollection.findOne({username: {$eq: username}})

  if (user === null || user.resetPassword.answer.toLowerCase() !== securityQuestionAnswer) {
    return {
      statusCode: 200,
      body: JSON.stringify({error: 'user not found / incorrect answer'})
    }
  } else {
    try {
      await usersCollection.update(username, {password: password})
    } catch {
      return {
        statusCode: 200,
        body: JSON.stringify({error: 'error resetting password'})
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({success: 'password reset'})
    }
  }
}

module.exports = {handler}