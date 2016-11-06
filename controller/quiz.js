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


    }
    console.log(response.text, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
    convo.say("Awesome.")
    convo.next()
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

const temp = function(response, convo) {
  let text = "Ok cool. Let's see how well you know him..."
  let quickReplies = [
    {
      type: "text",
      title: "Start the quiz!",
      payload: "Start the quiz!"
    },
  ]

  let reply = generateQuickReplies(text, quickReplies)
  convo.ask(reply, function(response, convo) {
    firstQ(response, convo)
    convo.next()
  })
}

const sendQuiz = (bot, message) => {

  let text = "Ok cool. Let's see how well you know him..."
  let quickReplies = [
    {
      type: "text",
      title: "Start the quiz!",
      payload: "Start the quiz!"
    },
  ]

  let reply = generateQuickReplies(text, quickReplies)
  convo.ask(reply, function(response, convo) {
    console.log(response, "$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    convo.say("yolo")
    convo.next()
  })



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

  bot.startConversation(message, temp)
}

module.exports = sendQuiz
