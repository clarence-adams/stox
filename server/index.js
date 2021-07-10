const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const got = require('got')
const mongoose = require('mongoose')
const {Schema} = mongoose

// configure the use of .env file and and initializes global variables

require('dotenv').config();

const PORT = process.env.PORT || 3001
const API_KEY = process.env.API_KEY
const MONGO_URI = process.env.MONGO_URI

// connects to MongoDB and logs an error if there is an error

mongoose.connect(
  MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('MongoDB Connected')
})
.catch(err => console.log(err))

const userSchema = new Schema ({
  name: String,
  age: Number,
  favoriteFoods: [String]
})

const User = mongoose.model('User', userSchema);

const app = express()

app.use(bodyParser.json())

// landing page

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/landing.html'))
})

// login page

app.get('/authentication', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/public/authentication.html'))
})

// dashboard

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('/dashboard', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})

app.use('/dashboard/quote', bodyParser.urlencoded({extended: false}))

app.post('/dashboard/quote', (req, res) => {
  (async () => {
    try {
      const response = await got(
        'https://cloud.iexapis.com/stable/stock/' + req.body.symbol + '/intraday-prices?token=' + API_KEY + '&chartLast=1'
      ).json()
      res.json({quote: response[0].average})
    } catch (error) {
      console.log(error.response.body)
    }
  })()
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})