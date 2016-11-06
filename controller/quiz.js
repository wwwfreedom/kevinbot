'use strict'

const generator = require('./generators.js')

let correctHillary = function(response, convo) {
  let text = "🙌 Oh yea, that was the correct choice!"
  let buttons = [
    {
      type: "postback",
      title: "Next ➡️",
      payload: "next"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, function(response, convo) {
    secondQ(response, convo)
    convo.next()
  })
}

let incorrectHillary = function(response, convo) {
  let text = "Oh 💩 - you're wrong. He's voting for Hillary! 🇺🇸"
  let buttons = [
    {
      type: "postback",
      title: "Next ➡️",
      payload: "next"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, function(response, convo) {
    secondQ(response, convo)
    convo.next()
  })
}

let firstQ = function(response, convo) {
  let text = "1. If he could vote in the upcoming 🇺🇸 election he'll be voting for:"

  let buttons = [
    {
      type: "postback",
      title: "Hillary Clinton",
      payload: "hillary"
    },
    {
      type: "postback",
      title: "Donald Trump",
      payload: "trump"
    },
    {
      type: "postback",
      title: "Someone else",
      payload: "someone"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)

  convo.say("Ok cool. Let's see how well you know him...")
  convo.ask(reply, function(response, convo) {
    if (response.text === 'hillary') {
      correctHillary(response, convo)
      convo.next()
    } else {
      incorrectHillary(response, convo)
      convo.next()
    }
  })
}

let secondQ = (respones, convo) => {
  let text = "2. he's got how many siblings:"

  let buttons = [
    {
      type: "postback",
      title: "10",
      payload: "hillary"
    },
    {
      type: "postback",
      title: "1",
      payload: "trump"
    },
    {
      type: "postback",
      title: "3",
      payload: "someone"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, fa)
}

const sendQuiz = (bot, message) => {
  bot.startConversation(message, temp)
}

module.exports = sendQuiz
