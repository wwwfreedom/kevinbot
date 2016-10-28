'use strict'

if (!process.env.page_token) {
  console.log('Error: Specify page_token in environment');
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify verify_token in environment');
  process.exit(1);
}

/* const express = require('express')
 * const bodyParser = require('body-parser')
 * const request = require('request')
 * const app = express()*/
const Botkit = require('botkit')

const controller = Botkit.facebookbot({
  debug: true,
  access_token: process.env.page_token,
  verify_token: process.env.verify_token
})

const bot = controller.spawn({
})

controller.hears(['hello', 'hi'], 'message_received', (bot, message) => {
  controller.storage.users.get(message.user, (err, user) => {
    if (user && user.name) {
      bot.reply(message, `Hello ${user.name}!!`)
    } else {
      bot.reply(message, 'Hello.')
    }
  })
})
