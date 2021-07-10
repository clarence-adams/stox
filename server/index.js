const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const got = require('got')

require('dotenv').config();

const PORT = process.env.PORT || 3001
const API_KEY = process.env.API_KEY

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