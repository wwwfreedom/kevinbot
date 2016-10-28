'use strict'

if (!process.env.page_token) {
  console.log('Error: Specify page_token in environment');
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify verify_token in environment');
  process.exit(1);
}

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const facebook_handler = require('./controller/botkit.js')


app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

app.get('/webhook', function (req, res) {
  // This enables subscription to the webhooks
  if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === process.env.verify_token) {
    res.send(req.query['hub.challenge'])
  }
  else {
    res.send('Incorrect verify token')
  }
})

app.post('/webhook', function (req, res) {
  facebook_handler(req.body)

  res.send('ok')
})
