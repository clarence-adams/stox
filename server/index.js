const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const cors = require('cors')
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

// connects to MongoDB and sets the User schema

mongoose.connect(
  MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => {
  console.log('MongoDB Connected')
})
.catch(err => console.error(err))

const userSchema = new Schema ({
  id: Number,
  username: String,
  password: String,
  resetPassword: {question: String, answer: String},
  cash: Number,
  purchases: [{symbol: String, shares: Number, shareValue: Number, date: Date}],
  sales: [{symbol: String, shares: Number, shareValue: Number, date: Date}],
  positions: [{symbol: String, shares: Number, averageShareValue: Number}]
})
const User = mongoose.model('User', userSchema);

// starts middleware for body parsing, static file hosting, cors and sessions

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/static', express.static(PUBLIC_FOLDER))

let sessionSecret = Math.random().toString(16).substr(2, 8)

setInterval(() => {
  sessionSecret = Math.random().toString(16).substr(2, 8)
}, 1800000)

app.use(cookieSession({
  name: 'session',
  secret: sessionSecret,
  sameSite: true
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
      resetPassword: {
        question: req.body['security-question'], 
        answer: hashFunction.SHA256(req.body['security-question-answer'].toLowerCase())
      },
      cash: 10000,
      purchases: [],
      sales: [],
      positions: []
    })

  newUser.save((err, data) => {
    if (err) {
      return console.error(err)
    } else {
      req.session.authenticated = true
      req.session.username = req.body.username
      res.status(301).redirect('/dashboard')
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
    res.status(301).redirect('/dashboard')
  } else {
    res.sendFile(path.resolve(PUBLIC_FOLDER, 'authentication.html'))
  }
})

// authentication endpoint
app.use('/authenticate', bodyParser.urlencoded({extended: false}))
app.post('/authenticate', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) {
      console.error(err)
    } else if (user === null) {
      res.json({error: 'username does not exist'})
    } else {
      const username = user.username
      const userPassword = user.password
      const enteredPassword = hashFunction.SHA256(req.body.password)

      if (userPassword === enteredPassword) {
        req.session.authenticated = true
        req.session.username = username
        res.status(301).json({authenticated: true, redirectUrl: '/dashboard'})
      } else {
        res.json({error: 'incorrect password'})
      }
    }
  })
})

//
// password reset
//

app.get('/reset-password', (req, res) => {
  res.sendFile(path.resolve(PUBLIC_FOLDER, 'reset-password.html'))
})

app.use('/reset-password', bodyParser.urlencoded({extended: false}))
app.post('/reset-password', (req, res) => {
  User.findOne({username: req.body.username}, (err, user) => {
    const securityQuestionAnswer = hashFunction.SHA256(req.body.answer.toLowerCase())
    if (err) {
      console.error(err)
    } else if (securityQuestionAnswer !== user.resetPassword.answer) {
      res.json({error: 'incorrect security question answer'})
    } else {
      user.password = hashFunction.SHA256(req.body.password)
      user.save((err) => {
        if (err) {
          console.error(err)
        } else {
          res.status(301).json({success: true, redirectUrl: '/authentication'})
        }
      })
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

app.use('/user', bodyParser.urlencoded({extended: false}))
app.post('/user', (req, res) => {
  if (!req.session.authenticated) {
    User.findOne({username: req.body.username}, (err, user) => {
      if (err) {
        console.error(err)
      } else {
        res.json({
          securityQuestion: user.resetPassword.question
        })
      }
    })
  } else {
    User.findOne({username: req.session.username}, (err, user) => {
      if (err) {
        console.error(err)
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

// disabled caching for the logout endpoint

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
  res.status(301).redirect('/authentication')
})

// stock quote
app.use('/dashboard/quote', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/quote', (req, res) => {
  if (!req.session.authenticated) {
    res.status(401).json({error: 'you must log in first!'})
  } else {
    (async () => {
        const quote = await fetchQuote(req.body.symbol)
        if (quote[0] === undefined) {
          res.json({error: 'invalid symbol'})
        } else if (quote[0].average === null) {
          res.status(401).json({error: 'average is null'})
        } else {
          res.json({quote: quote[0].average})
        }
    })()
  }
})

// stock buy
app.use('/dashboard/buy', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/buy', (req, res) => {
  if (!req.session.authenticated) {
    res.status(401).json({error: 'you must log in first!'})
  } else {
    User.findOne({username: req.session.username}, (err, user) => {
      if (err) {
        console.error(err)
      } else if (req.body.shares === '') {
        res.status(401).json({error: 'blank shares'})
      } else {
        (async () => {
          const quote = await fetchQuote(req.body.symbol)
          const shares = parseInt(req.body.shares)

          if (quote[0] === undefined) {
            res.json({error: 'invalid symbol'})
          } else if (shares === 0) {
            res.json({error: '0 shares'})
          } else if (quote[0].average === null) {
            res.status(401).json({error: 'average is null'})
          } else {
            const shareValue = quote[0].average
            const orderTotal = shareValue * shares

            if (user.cash < orderTotal) {
              res.status(401).json({error: 'user needs more cash'})
            } else {
              // records new transaction in user purchases
              user.cash = user.cash - orderTotal
              user.purchases.push({
                symbol: req.body.symbol, 
                shares: shares, 
                shareValue: shareValue, 
                date: new Date()
              })
              // if user does not already have a position in the stock a new position is created
              if (!user.positions.find((element) => isSymbol(element.symbol, req.body.symbol))) {
                user.positions.push({
                  symbol: req.body.symbol,
                  shares: shares,
                  averageShareValue: shareValue
                })
              // if user does already have a position in the stock calculates a new average and adds shares to portfolio
              } else {
                const position = user.positions.find((element) => isSymbol(element.symbol, req.body.symbol))
                const positionIndex = user.positions.findIndex((element) => isSymbol(element.symbol, req.body.symbol))
                const requestedShares = shares
                const newAverageShareValue = 
                ((position.shares * position.averageShareValue) 
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
                  console.error(err)
                  res.json({error: 'failed to save user changes'})
                } else {
                  res.json({error: 'successful'})
                }
              })
            }
          }
        })()
      }
    })
  }
})

// stock sell
app.use('/dashboard/sell', bodyParser.urlencoded({extended: false}))
app.post('/dashboard/sell', (req, res) => {
  if (!req.session.authenticated) {
    res.status(401).json({error: 'you must log in first!'})
  } else {
    User.findOne({username: req.session.username}, (err, user) => {
      if (err) {
        console.error(err)
      } else if (req.body.shares === '') {
        res.status(401).json({error: 'blank shares'})
      } else {
        (async () => {
          const quote = await fetchQuote(req.body.symbol)
          const shares = parseInt(req.body.shares)

          if (quote[0] === undefined) {
            res.json({error: 'invalid symbol'})
          } else if (shares === 0) {
            res.json({error: '0 shares'})
          } else if (quote[0].average === null) {
            res.status(401).json({error: 'average is null'})
          } else {
            const shareValue = quote[0].average
            const orderTotal = shareValue * shares

            const currentPosition = user.positions.find((element) => isSymbol(element.symbol, req.body.symbol))

            if (currentPosition === undefined) {
              res.json({error: 'position does not exist'})
            } else if (currentPosition.shares < shares) {
              res.json({error: 'user needs more shares'})
            } else {
              // records new transaction in user sales
              user.cash = user.cash + orderTotal
              user.sales.push({
                symbol: req.body.symbol, 
                shares: shares, 
                shareValue: shareValue, 
                date: new Date()
              })
              const currentPositionIndex = user.positions.findIndex((element) => isSymbol(element.symbol, req.body.symbol))
              // if user is selling all of their available shares the position is removed from their portfolio
              if (currentPosition.shares === shares) {
                user.positions.splice(currentPositionIndex, 1)
              // if user is not selling all of their available shares updates the current position
              } else {
                user.positions[currentPositionIndex].shares = currentPosition.shares - shares
              }
              user.save((err) => {
                if (err) {
                  console.error(err)
                  res.json({error: 'failed to save user changes'})
                } else {
                  res.json({error: 'successful'})
                }
              })
            }
          }
        })()
      }
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

// helper function for getting stock info
const fetchQuote = (symbol) => {
  const quote = got(
    'https://cloud.iexapis.com/stable/stock/' 
    + symbol 
    + '/intraday-prices?token=' 
    + API_KEY 
    + '&chartLast=1'
  ).json()
  .catch(error => {
    return error
  })

  return quote
}
const isSymbol = (string, symbol) => {
  if (string === symbol) {
    return true
  }
}