'use strict'

const generator = require('./generators.js')

let firstQ = function(response, convo) {
  let text = "1. If he could vote in the upcoming 🇺🇸 election he'll be voting for:"

  let buttons = [
    {
      type: "postback",
      title: "Hillary Clinton",
      payload: "hilary"
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
    console.log(response.text, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    convo.say("Awesome.")
    convo.next()
  })
}

const sendQuiz = (bot, message) => {

  let askMore = function(response, convo) {
        convo.ask(reply, function(response, convo) {
      console.log(response, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
      askLess(response, convo)
      convo.say("Awesome.")
      convo.next()
    })
  }

  let askFlavor = function(response, convo) {

    let text = "Ok cool. Let's see how well you know him..."
    let buttons = [
      {
        type: "postback",
        title: "Learn about him 👨🏻",
        payload: "yolojj"
      },
      {
        type: "postback",
        title: "Get my own bot 🤖",
        payload: "yoloasdfssa"
      }
    ]

    let reply = generator.buttonTemplate(text, buttons)

    convo.ask(reply, function(response, convo) {
      askMore(response, convo)
      convo.next()
    })
  }

  let askToStart = function (response, convo) {
    let text = "Ok cool. Let's see how well you know him..."
    let buttons = [
      {
        type: "postback",
        title: "Learn about him 👨🏻",
        payload: "yolojj"
      },
      {
        type: "postback",
        title: "Get my own bot 🤖",
        payload: "yoloasdfssa"
      }
    ]

    let reply = generator.buttonTemplate(text, buttons)

    convo.ask(reply, function (response, convo) {
      askFlavor(response, convo)
      convo.next()
    })
  }

  bot.startConversation(message, firstQ)
}

module.exports = sendQuiz
