'use strict'

const generator = require('./generators.js')

let nextQuestion = function(response, convo, text, cb) {
  let buttons = [
    {
      type: "postback",
      title: "Next ➡️",
      payload: "next"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, function(response, convo) {
    cb(response, convo)
    convo.next()
  })
}

let quizComplete = function(response, convo, text, cb) {
  let buttons = [
    {
      type: "postback",
      title: "Quiz complete!",
      payload: "Quiz complete!"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, function(response, convo) {
    cb(response, convo)
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
      nextQuestion(response, convo, "🙌 Oh yea, that was the correct choice!", secondQ)
      convo.next()
    } else {
      nextQuestion(response, convo, "Oh 💩 - you're wrong. He's voting for Hillary! 🇺🇸", secondQ)
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
      payload: "10"
    },
    {
      type: "postback",
      title: "1",
      payload: "1"
    },
    {
      type: "postback",
      title: "3",
      payload: "3"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, (response, convo) => {
    if (response.text === '1') {
      nextQuestion(response, convo, "🙌 Oh yea, that was the correct choice!", thirdQ)
      convo.next()
    } else {
      nextQuestion(response, convo, "Oh 💩 - you're wrong. He's only has one younger brother.",thirdQ)
      convo.next()
    }
  })
}

let thirdQ = (respones, convo) => {
  let text = "3. The issue he cares most about is"

  let buttons = [
    {
      type: "postback",
      title: "AI development",
      payload: "AI development"
    },
    {
      type: "postback",
      title: "Climate change",
      payload: "Climate change"
    },
    {
      type: "postback",
      title: "Mars exploration",
      payload: "Mars exploration"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.ask(reply, (response, convo) => {
    if (response.text === 'AI development') {
      quizComplete(response, convo, "🙌 Oh yea, He's hoping that the AI overlord won't happen.", endQuiz)
      convo.next()
    } else {
      quizComplete(response, convo, "Nope, But that's important too! He's been learning about AI development and hoping to be in a position to steer AI development for good.", endQuiz)
      convo.next()
    }
  })
}

let endQuiz = (respones, convo) => {
  let text = "Nice work, on the quiz! Want to build your own? You need to create a bot!"

  let buttons = [
    {
      type: "postback",
      title: "Get my own bot",
      payload: "get my own bot"
    },
    {
      type: "postback",
      title: "No thanks",
      payload: "no thanks, to bot"
    }
  ]

  let reply = generator.buttonTemplate(text, buttons)
  convo.say(reply)
  convo.next()
}

const sendQuiz = (bot, message) => {
  bot.startConversation(message, firstQ)
}

module.exports = sendQuiz
