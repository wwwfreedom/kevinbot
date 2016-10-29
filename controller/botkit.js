'use strict'
const Botkit = require('botkit')
const request = require('request')
const Promise = require("bluebird")

const controller = Botkit.facebookbot({
  debug: false,
  access_token: process.env.page_token,
  verify_token: process.env.verify_token
})

const bot = controller.spawn({
})

const handleError = function(bot, message, err) {
	console.log(err)
	var reply = "Oops! Looks like there was an error. Here are the details.."

	bot.reply(message, reply, function(err, response) {

		bot.reply(message, err, function(err, response) {
			var reply = "Email kevintruongqt@gmail.com to report this bug."
			bot.reply(message, reply)
		})
	})
}

// subscribe to page events
request.post('https://graph.facebook.com/me/subscribed_apps?access_token=' + process.env.page_token,
  function (err, res, body) {
    if (err) {
      controller.log('Could not subscribe to page messages')
    }
    else {
      controller.log('Successfully subscribed to Facebook events:', body)
      console.log('Botkit activated')

      // start ticking to send conversation messages
      controller.startTicking()
    }
  }
)

console.log('botkit')


// Template generators

const generateButtonTemplate = (text, buttons) => {
  let buttonArr = buttons.map((button) => {
    return {
      "type": button.type,
      "title": button.title,
      "payload": button.payload
    }
  })
  return {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'button',
        text: text,
        buttons: buttonArr
      }
    }
  }
}

const generateQuickReplies = (text, replies) => {
  let quickReplies = replies.map((reply) => {
    return {
      "content_type": reply.type,
      "title": reply.title,
      "payload": reply.payload
    }
  })
  return {
    text: text,
    quick_replies: quickReplies
  }
}

const sendWelcomePromt = (bot, message) => {
  let text = "Hi! I’m Kevin's personal bot 🤖. Are you wanting to connect with him or get your own bot that people can talk to?"
  let buttons = [
    {
      type: "postback",
      title: "Learn about him 👨🏻",
      payload: "learn about him"
    },
    {
      type: "postback",
      title: "Get your own bot 🤖",
      payload: "get my own bot"
    }
  ]

  let reply = generateButtonTemplate(text, buttons)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const sendQuickRepliesAboutMe = (bot, message) => {
  let quickReplies = [
    {
      type: "text",
      title: "See menu",
      payload: "home menu"
    },
    {
      type: "text",
      title: "Gimme his story",
      payload: "story"
    },
    {
      type: "text",
      title: "Take his quiz!",
      payload: "quiz"
    },
    {
      type: "text",
      title: "Send him a msg",
      payload: "msg"
    }
  ]

  let text = "You should know, I can share a ton of stuff about Kevin. 📚 You can dig into his background, projects he's done, and even see what he’s reading."

  let reply = generateQuickReplies(text, quickReplies)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

controller.on('tick', (bot, event) => {
})

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function (bot, message) {
  bot.reply(message, 'Welcome, friend')
})

// user said hello
controller.hears(['hello'], 'message_received', function (bot, message) {
  bot.reply(message, 'Hey there.')
})

// user says anything else

controller.hears('(.*)', 'message_received', function (bot, message) {
  if (message.match[1] === 'See menu') bot.reply(message, "if you see this")
})


controller.on('facebook_postback', function(bot, message) {
  console.log(message.payload)

  if (message.payload === 'USER_DEFINED_PAYLOAD') sendWelcomePromt(bot, message)

  if (message.payload === 'learn about him') sendQuickRepliesAboutMe(bot, message)

  if (message.payload === 'get my own bot') bot.reply(message, "Kevin's is hard at work creating the tool for you to make your own personal bot. Leave him your email and you'll be the first to know when it's ready :)")

})


// this function processes the POST request to the webhook

var handler = function (obj) {
  controller.debug('GOT A MESSAGE HOOK')
  var message
  if (obj.entry) {
    for (var e = 0; e < obj.entry.length; e++) {
      for (var m = 0; m < obj.entry[e].messaging.length; m++) {
        var facebook_message = obj.entry[e].messaging[m]

        /* console.log(facebook_message)*/

        // normal message
        if (facebook_message.message) {
          message = {
            text: facebook_message.message.text,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp,
            seq: facebook_message.message.seq,
            mid: facebook_message.message.mid,
            attachments: facebook_message.message.attachments
          }

          // save if user comes from m.me adress or Facebook search
          /* create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)*/

          controller.receiveMessage(bot, message)
        }
        // clicks on a postback action in an attachment
        else if (facebook_message.postback) {
          // trigger BOTH a facebook_postback event
          // and a normal message received event.
          // this allows developers to receive postbacks as part of a conversation.
          message = {
            payload: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('facebook_postback', [bot, message])

          message = {
            text: facebook_message.postback.payload,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.receiveMessage(bot, message)
        }
        // When a user clicks on "Send to Messenger"
        else if (facebook_message.optin) {
          message = {
            optin: facebook_message.optin,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          // save if user comes from "Send to Messenger"
          /* create_user_if_new(facebook_message.sender.id, facebook_message.timestamp)*/

          controller.trigger('facebook_optin', [bot, message])
        }
        // message delivered callback
        else if (facebook_message.delivery) {
          message = {
            optin: facebook_message.delivery,
            user: facebook_message.sender.id,
            channel: facebook_message.sender.id,
            timestamp: facebook_message.timestamp
          }

          controller.trigger('message_delivered', [bot, message])
        }
        else {
          controller.log('Got an unexpected message from Facebook: ', facebook_message)
        }
      }
    }
  }
}

module.exports = handler
