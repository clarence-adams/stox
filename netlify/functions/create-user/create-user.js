const {createClient} = require('@astrajs/collections')
const jwt = require('jsonwebtoken')
const {sha256} = require('crypto-hash')

require('dotenv').config()

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const handler = async (event) => {
  let statusCode = 200

  // create an {astra_db} client
  const astraClient = await createClient({
    astraDatabaseId: process.env.ASTRA_DB_ID,
    astraDatabaseRegion: process.env.ASTRA_DB_REGION,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN,
  })

  // create a shortcut to the users collection in the app namespace/keyspace
  // collections are created automatically
  const usersCollection = astraClient.namespace('Stox').collection('users')

  const username = JSON.parse(event.body).username
  const password = await sha256(JSON.parse(event.body).password)
  const securityQuestion = JSON.parse(event.body).securityQuestion
  const securityAnswer = JSON.parse(event.body).securityAnswer

  // create a new document (specifying documentId)
  try {
    await usersCollection.create(username, {
      username: username,
      password: password,
      resetPassword: {
        question: securityQuestion,
        answer: securityAnswer
      },
      cash: 10000,
      purchases: [],
      sales: [],
      positions: []
    })
      
    statusCode = 200
  } catch (err) {
    console.error('Error creating user: ' + err)
    statusCode = 500
  }
  
  const accessToken = jwt.sign({username: username}, process.env.ACCESS_TOKEN_SECRET)

  return {
    statusCode: statusCode,
    headers: {'Set-Cookie': ['accessToken=' + accessToken]}
  }
}

module.exports = {handler}