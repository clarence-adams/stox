const path = require('path')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const got = require('got')
const mongoose = require('mongoose')
const {Schema} = mongoose
const hashFunction = require('./hashFunction.js')

// configure the use of .env file and and initializes global variables

require('dotenv').config();

const PORT = process.env.PORT || 3001
const API_KEY = process.env.API_KEY
const MONGO_URI = process.env.MONGO_URI

const PUBLIC_FOLDER = path.resolve(__dirname, '../client/public')
const REACT_BUILD = path.resolve(__dirname, '../client/build')

// connects to MongoDB and logs an error if there is an error

mongoose.connect(
  MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('MongoDB Connected')
})
.catch(err => console.log(err))

const userSchema = new Schema ({
  id: Number,
  username: String,
  password: String,
  cash: Number,
  purchases: [{symbol: String, shares: Number, shareValue: Number, date: Date}],
  sales: [{symbol: String, shares: Number, shareValue: Number, date: Date}],
  positions: [{symbol: String, shares: Number, averageShareValue: Number}]
})
const User = mongoose.model('User', userSchema);

const app = express()
app.use(cors())

// starts middleware for body parsing, static file hosting, and sessions

app.use(bodyParser.json())
app.use('/static', express.static(PUBLIC_FOLDER))
app.use(cookieSession({
  name: 'session',
  secret: 'super duper secret'
}))

//
// landing page
//

app.get('/', (req, res) => {
  res.sendFile(path.resolve(PUBLIC_FOLDER, 'landing.html'))
})

// registration endpoint
app.use('/register', bodyParser.urlencoded({extended: false}))
app.post('/register', (req, res) => {
  
  const newUser = new User({
      username: req.body.username,
      password: hashFunction.SHA256(req.body.password),
      cash: 10000,
      purchases: [],
      sales: [],
      positions: []
    })

  newUser.save((err, data) => {
    if (err) {
      return console.log(err)
    } else {
      req.session.authenticated = true
      req.session.username = req.body.username
      res.redirect(301, '/dashboard')
    }
  })
})

// username validation endpoint
app.use('/register/username', bodyParser.urlencoded({extended: false}))
app.post('/register/username', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      console.error(err)
    } else {
      if (user === null) {
        res.json({available: true})
      } else {
        res.json({available: false})
      }
    }
  })
})

//
// authentication page
//

app.get('/authentication', (req, res) => {
  if (req.session.authenticated) {
    console.log('redirected from authentication')
    res.redirect(301, '/dashboard')
  } else {
    res.sendFile(path.resolve(PUBLIC_FOLDER, 'authentication.html'))
  }
})

// authentication endpoint
app.use('/authenticate', bodyParser.urlencoded({extended: false}))
app.post('/authenticate', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      return console.error(err)
    } else {
      const username = user.username
      const userPassword = user.password
      const enteredPassword = hashFunction.SHA256(req.body.password)

      if (userPassword === enteredPassword) {
        req.session.authenticated = true
        req.session.username = username
        res.redirect(301, '/dashboard')
      } else {
        res.json({error: 'incorrect password'})
      }
    }
  })
})

//
// dashboard
//

app.use(express.static(REACT_BUILD))

app.get('/dashboard', (req, res) => {
  if (req.session.authenticated) {
    res.sendFile(path.resolve(REACT_BUILD, 'index.html'))
  } else {
    res.redirect(301, '/authentication')
  }
})

// user info
app.get('/dashboard/user', (req, res) => {
  if (!req.session.authenticated) {
    res.json({error: 'you must log in first!'})
  } else {
    User.findOne({username: req.session.username}, (err, user) => {
      if (err) {
        console.log(err)
      } else {
        res.json({
          authenticated: req.session.authenticated,
          username: user.username,
          cash: user.cash,
          purchases: user.purchases,
          sales: user.sales,
          positions: user.positions
        })
      }
    })
  }
})

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
// logout endpoint
app.get('/dashboard/logout', (req, res) => {
  try {
    req.session = null
  } catch (err) {
    console.log(err)
  }

  res.redirect(301, '/authentication')
})

// stock quote
app.use('/dashboard/quote', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/quote', (req, res) => {
  (async () => {
    try {
      const response = await got(
        'https://cloud.iexapis.com/stable/stock/' 
        + req.body.symbol 
        + '/intraday-prices?token=' 
        + API_KEY 
        + '&chartLast=1'
      ).json()
      res.json({quote: response[0].average})
    } catch (err) {
      console.error(err.response.body)
    }
  })()
})

// stock buy
app.use('/dashboard/buy', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/buy', (req, res) => {
  User.findOne({username: req.session.username}, (err, user) => {
    if (err) {
      console.error(err)
    } else {
      (async () => {
        const quote = await fetchQuote(req.body.symbol)
        const shareValue = quote[0].average
        const orderTotal = shareValue * req.body.shares

        // ensures user has enough cash to complete transaction
        if (user.cash < orderTotal) {
          res.json({error: 'User needs more cash'})
        } else {
          const isSymbol = (string) => {
            if (string === req.body.symbol) {
              return true
            }
          }
          // records new transaction in user purchases
          user.cash = user.cash - orderTotal
          user.purchases.push({
            symbol: req.body.symbol, 
            shares: req.body.shares, 
            shareValue: shareValue, 
            date: new Date()
          })
          // if user does not already have a position in the stock a new position is created
          if (!user.positions.find((element) => isSymbol(element.symbol))) {
            user.positions.push({
              symbol: req.body.symbol,
              shares: req.body.shares,
              averageShareValue: shareValue
            })
          // if user does already have a position in the stock calculates a new average and adds shares to portfolio
          } else {
            const position = user.positions.find((element) => isSymbol(element.symbol))
            const positionIndex = user.positions.findIndex((element) => isSymbol(element.symbol))
            const requestedShares = parseFloat(req.body.shares)
            const newAverageShareValue = ((position.shares * position.averageShareValue) 
            + (requestedShares * shareValue)) 
            / (position.shares + requestedShares)

            user.positions[positionIndex] = {
              symbol: req.body.symbol,
              shares: position.shares + requestedShares,
              averageShareValue: newAverageShareValue
            }
          }
          user.save((err) => {
            if (err) {
              console.log(err)
              res.json({error: 'failed to save user changes'})
            } else {
              res.json({transaction: 'successful'})
            }
          })
        }
      })()
    }
  })
})

// stock sell
app.use('/dashboard/sell', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/sell', (req, res) => {
  User.findOne({username: req.session.username}, (err, user) => {
    if (err) {
      console.error(err)
    } else {
      (async () => {
        const quote = await fetchQuote(req.body.symbol)
        const shareValue = quote[0].average
        const orderTotal = shareValue * req.body.shares

        const isSymbol = (string) => {
          if (string === req.body.symbol) {
            return true
          }
        }

        const currentPosition = user.positions.find((element) => isSymbol(element.symbol))

        if (currentPosition.shares < req.body.shares) {
          res.json({error: 'User needs more shares'})
        } else {
          // records new transaction in user sales
          user.cash = user.cash + orderTotal
          user.sales.push({
            symbol: req.body.symbol, 
            shares: req.body.shares, 
            shareValue: shareValue, 
            date: new Date()
          })
          const currentPositionIndex = user.positions.findIndex((element) => isSymbol(element.symbol))
          // if user is selling all of their available shares the position is removed from their portfolio
          if (currentPosition.shares == req.body.shares) {
            user.positions.splice(currentPositionIndex, 1)
          // if user is not selling all of their available shares updates the current position
          } else {
            user.positions[currentPositionIndex].shares = currentPosition.shares - req.body.shares
          }
          user.save((err) => {
            if (err) {
              console.log(err)
              res.json({error: 'failed to save user changes'})
            } else {
              res.json({transaction: 'successful'})
            }
          })
        }
      })()
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

const fetchQuote = (symbol) => {
  const quote = got(
    'https://cloud.iexapis.com/stable/stock/' 
    + symbol 
    + '/intraday-prices?token=' 
    + API_KEY 
    + '&chartLast=1'
  ).json()
  .catch((error) => console.error(error))

  return quote
}