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

const generateGenericTemplate = (elements) => ({
  attachment: {
    type: 'template',
    payload: {
      template_type: 'generic',
      elements: elements
    }
  }
})

const generateImageTemplate = (link) => ({
  attachment: {
    type: 'image',
    payload: {
      url: link
    }
  }
})

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

const sendGenericMenu = (bot, message) => {
  let menu = require('../data/menu.js')

  let reply = generateGenericTemplate(menu)
  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const sendBiographyQuickReplies = (bot, message) => {
  let text = "Do you want to hear his whole life story or just skip to a certain thing?"
  let quickReplies = [
    {
      type: "text",
      title: "Life story",
      payload: "life story"
    },
    {
      type: "text",
      title: "Education",
      payload: "education"
    },
    {
      type: "text",
      title: "Work history",
      payload: "work history"
    },
    {
      type: "text",
      title: "💜 status",
      payload: "love status"
    },
    {
      type: "text",
      title: "Random facts",
      payload: "random facts"
    }
  ]

  let reply = generateQuickReplies(text, quickReplies)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

/* const askFlavor = function(response, convo) {
 *   let text = "Do you want to hear his whole life story or just skip to a certain thing?"
 *   let quickReplies = [
 *     {
 *       type: "text",
 *       title: "Life story",
 *       payload: "life story"
 *     },
 *     {
 *       type: "text",
 *       title: "Education",
 *       payload: "education"
 *     },
 *     {
 *       type: "text",
 *       title: "Work history",
 *       payload: "work history"
 *     },
 *     {
 *       type: "text",
 *       title: "💜 status",
 *       payload: "love status"
 *     },
 *     {
 *       type: "text",
 *       title: "Random facts",
 *       payload: "random facts"
 *     }
 *   ]
 *
 *   let reply = generateQuickReplies(text, quickReplies)
 *
 *   convo.ask(reply, function(response, convo) {
 *     console.log(response, "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^")
 *     convo.say("Awesome.")
 *     askSize(response, convo)
 *     convo.next()
 *   })
 * }
 * const askSize = function(response, convo) {
 *   convo.ask("What size do you want?", function(response, convo) {
 *     convo.say("Ok.")
 *     askWhereDeliver(response, convo)
 *     convo.next()
 *   })
 * }
 *
 * const askWhereDeliver = function(response, convo) {
 *   convo.ask("So where do you want it delivered?", function(response, convo) {
 *     convo.say("Ok! Goodbye.")
 *     convo.next()
 *   })
 * }*/

const tellPartOneLifeStory = (bot, message) => {
  let readyImg = generateImageTemplate("https://media.giphy.com/media/75yYfqYy5tmHm/giphy.gif")
  let houseImg = generateImageTemplate("http://resources2.news.com.au/images/2012/05/06/1226347/897142-bullet-holes-in-enfield-house.jpg")
  bot.startTyping(message, () => {})
  setTimeout(() => {
    bot.stopTyping(message, () => {
      bot.reply(message, "He's had an interesting but complicated story.", (err, response) => {
        bot.reply(message, readyImg)
        bot.replyWithTyping(message, "He grew up on North side of Adelaide - mostly in Salisbury Downs in this house:", () => {
          bot.reply(message, houseImg, () => {
            let text = "Do you want to hear his whole life story or just skip to a certain thing?"
            let quickReplies = [
              {
                type: "text",
                title: "Whole story!",
                payload: "Whole story!"
              },
              {
                type: "text",
                title: "Skip around",
                payload: "Skip around"
              }
            ]

            let reply = generateQuickReplies(text, quickReplies)

            bot.replyWithTyping(message, reply)
          })
        })
      })
    })
  }, 800)
}

const tellPartTwoLifeStory = (bot, message) => {
  bot.startTyping(message, () => {})
  bot.reply(message, "One day, in an act of kindess, Kevin's grandpa who was living in Australia applied to sponsor Kevin's and his family to migrate to Australia", () => {
    bot.replyWithTyping(message, "Because of that, Kevin was able to grow up in Australia. A land of the free and boundless opportunity. ", () => {
      bot.replyWithTyping(message, "However, there was a difficult period where language barrier and cultural differences threaten to derails Kevin's plan to become the first in his family to graduate from university", () => {
        let text = "What to want know more or skip around?"
        let quickReplies = [
          {
            type: "text",
            title: "What happen?",
            payload: "Whole story!"
          },
          {
            type: "text",
            title: "Skip around",
            payload: "Skip around"
          }
        ]

        let reply = generateQuickReplies(text, quickReplies)

        bot.replyWithTyping(message, reply)
      })
    })
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

controller.hears(['Whole story!'], 'message_received', (bot, message) => {
  tellPartTwoLifeStory(bot, message)
})

// user says anything else
controller.hears('(.*)', 'message_received', function (bot, message) {
  console.log(message.match[1], "****************************************************")
  if (message.match[1] === 'See menu') sendGenericMenu(bot, message)

  if (message.match[1] === 'Life story') tellPartOneLifeStory(bot, message)

  /* if (message.match[1] === 'Whole story!') bot.reply(message, "Cool the story is gonna be long")*/

})




controller.on('facebook_postback', function(bot, message) {

  if (message.payload === 'USER_DEFINED_PAYLOAD') sendWelcomePromt(bot, message)

  if (message.payload === 'learn about him') sendQuickRepliesAboutMe(bot, message)

  if (message.payload === 'get my own bot') bot.reply(message, "Kevin's is hard at work creating the tool for you to make your own personal bot. Leave him your email and you'll be the first to know when it's ready :)")

  if (message.payload === 'bio') sendBiographyQuickReplies(bot, message)

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
