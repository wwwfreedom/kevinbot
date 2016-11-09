'use strict'
const Botkit = require('botkit')
const request = require('request')
const sendQuiz = require('./quiz.js')
const generator = require('./generators.js')
const axios = require('axios')

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

const sendWelcomePromt = (bot, message) => {
  axios.get(`https://graph.facebook.com/v2.6/${message.user}?fields=first_name,last_name&access_token=${process.env.page_token}`)
    .then((response) => {
      console.log(response)
      let text = `Hi ${body.first_name}! I’m Kevin's personal bot 🤖. Are you wanting to connect with him or get your own bot that people can talk to?`
      let buttons = [
        {
          type: "postback",
          title: "Learn about him 👨🏻",
          payload: "learn about him"
        },
        {
          type: "postback",
          title: "Get my own bot 🤖",
          payload: "get my own bot"
        }
      ]

      let reply = generator.buttonTemplate(text, buttons)

      bot.reply(message, reply, (err, response) => {
        if (err) handleError(bot, message, err)
      })
    })
  /* request({
   *   url: `https://graph.facebook.com/v2.6/${message.user}?fields=first_name,last_name`,
   *   qs: {access_token:process.env.page_token},
   *   method: 'GET',
   * }, function(error, response, body) {
   *   console.log(JSON.parse(body))
   *   console.log(JSON.parse(body.toString()), "####################")
   *   if (error) {
   *     console.log('Error sending messages: ', error)
   *   } else if (response.body.error) {
   *     console.log('Error: ', response.body.error)
   *   } else {
   *         }
   * })*/
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
      title: "See his works",
      payload: "work"
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

  let reply = generator.quickReplies(text, quickReplies)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const sendGenericMenu = (bot, message) => {
  let menu = require('../data/menu.js')

  let reply = generator.genericTemplate(menu)
  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const sendGenericProjectsTemplate = (bot, message) => {
  let projects = require('../data/projects.js')

  let reply = generator.genericTemplate(projects)

  bot.reply(message, reply)
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

  let reply = generator.quickReplies(text, quickReplies)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const tellPartOneLifeStory = (bot, message) => {
  let readyImg = generator.imageTemplate("https://media.giphy.com/media/75yYfqYy5tmHm/giphy.gif")
  let houseImg = generator.imageTemplate("http://resources2.news.com.au/images/2012/05/06/1226347/897142-bullet-holes-in-enfield-house.jpg")
  bot.reply(message, "He's had an interesting but complicated story.", () => {
    bot.reply(message, readyImg, () => {
      bot.replyWithTyping(message, "He grew up on the North side of Adelaide - mostly in Salisbury Downs in this house:", () => {
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

          let reply = generator.quickReplies(text, quickReplies)

          bot.replyWithTyping(message, reply)
        })
      })
    })
  })
}

const tellPartTwoLifeStory = (bot, message) => {
  let jupiterBookImg = generator.imageTemplate("https://images-na.ssl-images-amazon.com/images/I/51HD1KCKR8L.jpg")
  bot.startTyping(message, () => {})
  bot.reply(message, "Kevin spent his childhood dreaming of exploring faraway places. He read this book.", () => {
    bot.reply(message, jupiterBookImg, () => {
      bot.replyWithTyping(message, "He decided that his life dream would be to travel around the world by motorbike", () => {
        let text = "Want to know more or skip around?"
        let quickReplies = [
          {
            type: "text",
            title: "On to university",
            payload: "Whole story!"
          },
          {
            type: "text",
            title: "Skip around",
            payload: "Skip around"
          }
        ]

        let reply = generator.quickReplies(text, quickReplies)

        bot.replyWithTyping(message, reply)
      })
    })
  })
}

const sendBioMenu = (bot, message) => {
  let text = "Choose an option below"
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
    }
  ]

  let reply = generator.quickReplies(text, quickReplies)

  bot.reply(message, reply, (err, response) => {
    if (err) handleError(bot, message, err)
  })
}

const sendDemoProjects = (bot, message) => {
  bot.reply(message, "You can check out my demo projects at my personal site by clicking on the links below.", () => {
    sendGenericProjectsTemplate(bot, message)

    let text = "Learn more about his work or go back to menu."
    let quickReplies = [
      {
        type: "text",
        title: "Skills & Expertise",
        payload: "Skills & Expertise"
      },
      {
        type: "text",
        title: "Work Interests",
        payload: "Work Interests"
      },
      {
        type: "text",
        title: "See menu",
        payload: "See menu"
      }
    ]

    let reply = generator.quickReplies(text, quickReplies)

    bot.replyWithTyping(message, reply)
  })
}

const sendCurrentLocation = (bot, message) => {
  bot.reply(message, "Here's where Kevin been most recently.", () => {
    let location = [{
      title: "Kevin's Current Location",
      subtitle: "Kevin is currently in Melbourne",
      image_url: "http://maps.googleapis.com/maps/api/staticmap?center=melbourne+australia&zoom=14&scale=2&size=600x300&maptype=roadmap&format=png&visual_refresh=true&markers=size:tiny%7Ccolor:0xff0000%7Clabel:1%7Cmelbourne+australia"
    }]

    let reply = generator.genericTemplate(location)

    bot.reply(message, reply)
  })
}

const sendLiveChatInstruction = (bot, message) => {
  bot.reply(message, "How this works is pretty simple. You'll get notified whenever Kevin turns live chat on... so jump on in when it's on!", () => {
    let text = "Got it?"
    let quickReplies = [
      {
        type: "text",
        title: "Got it!",
        payload: "Got it!"
      },
      {
        type: "text",
        title: "Leave a message",
        payload: "Leave a message"
      }
    ]

    let reply = generator.quickReplies(text, quickReplies)

    bot.replyWithTyping(message, reply)
  })
}

const sendReplyToLeaveAMessage = (bot, message) => {
  const askForMessage = (response, convo) => {
    convo.ask("What would you like to say to Kevin?", (response, convo) => {
      convo.say("Thanks for reaching out 😀, Kevin will get back to you soon.")
      convo.next()
    })
  }
  bot.startConversation(message, askForMessage)
}

const sendBookAMeeting = (bot, message) => {
  bot.startConversation(message, (err, convo) => {
    convo.say("Kevin's available at during the following times to meet with you at your convenience.")
    let meetingTime = require('../data/meetingTime.js')

    let reply = generator.genericTemplate(meetingTime)
    convo.ask(reply, (response, convo) => {

      // maybe send email at this stage to myself.
      convo.say("Thank you. I've noted down the time you like to meet Kevin, he'll send you a quick confirmation message with further instructions soon.")
      convo.next()
    })
  })
}

const sendReplyToNothanks = (bot, message) => {
  let text = "No worries! It’s easy to book a time to chat 1:1 via Messenger, leave a private 💬, or even 📅 schedule an in-person meeting."

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
      title: "See his works",
      payload: "work"
    },
    {
      type: "text",
      title: "Send him a msg",
      payload: "msg"
    }
  ]

  let reply = generator.quickReplies(text, quickReplies)
  bot.reply(message, reply)
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

controller.hears(['Gimme his story'], 'message_received', (bot, message) => {
  sendBiographyQuickReplies(bot, message)
})

controller.hears(['Whole story!'], 'message_received', (bot, message) => {
  tellPartTwoLifeStory(bot, message)
})

controller.hears(['Take his quiz!'], 'message_received', function(bot, message) {
  sendQuiz(bot, message)
})

controller.hears(['On to university'], 'message_received', (bot, message) => {
  bot.replyWithTyping(message, "He always had a strong internal drive to succeed and make his own way in the world.", () => {
    bot.replyWithTyping(message, "Academic life was interesting. In university, he challenged himself by learning Japanse. Spending half a year on a study exchange in Singapore and another one in Austria. ", () => {
      let text = "Want to know more or skip around?"
      let quickReplies = [
        {
          type: "text",
          title: "What'd he study?",
          payload: "study"
        },
        {
          type: "text",
          title: "Skip around",
          payload: "Skip around"
        }
      ]

      let reply = generator.quickReplies(text, quickReplies)

      bot.replyWithTyping(message, reply)
    })
  })
})

controller.hears(["Skip around"], 'message_received', (bot, message) => {
  sendBioMenu(bot, message)
})

controller.hears(["What'd he study?", "Education"], 'message_received', (bot, message) => {
  bot.startTyping(message, () => {})
  bot.reply(message, "He got his undergraduate degree in Commerce and Applied Finance at the university of South Australia.", () => {
    bot.replyWithTyping(message, "Throughout university, he also pursued his other passion in programming. He is nearing completion of his full-stack web programming course at 'Free Code Camp'.", () => {
      let text = "Find out why?"
      let quickReplies = [
        {
          type: "text",
          title: "Why Programming?",
          payload: "study"
        },
        {
          type: "text",
          title: "Why Commerce?",
          payload: "Why Commerce?"
        }
      ]

      let reply = generator.quickReplies(text, quickReplies)

      bot.replyWithTyping(message, reply)
    })
  })
})

controller.hears(['Why Programming'], 'message_received', (bot, message) => {
  let programingImg = generator.imageTemplate("http://i.giphy.com/DnVvp3yHjdhyo.gif")
  bot.startTyping(message, () => {})
  bot.reply(message, "Learning how to code was immensely satisfying for him. From seeing a simple hello world program to making advance web application. The fact that he could make something useful that millions could use is awe inspiring for him.", () => {
    bot.reply(message, programingImg, () => {
      let text = "Find out why?"
      let quickReplies = [
        {
          type: "text",
          title: "Why Commerce?",
          payload: "Why Commerce?"
        },
        {
          type: "text",
          title: "Learn about his work",
          payload: "Learn about his work"
        }
      ]

      let reply = generator.quickReplies(text, quickReplies)

      bot.replyWithTyping(message, reply)
    })
  })
})

controller.hears(["Why Commerce?"], 'message_received', (bot, message) => {
  bot.startTyping(message, () => {})
  let moneyImg = generator.imageTemplate("http://i.giphy.com/3o7aTvTXlhr9PuWg1i.gif")
  bot.reply(message, "Studying commerce meant digging into interesting problem like inflation, internation trade, debt and globalization.", () => {
    bot.replyWithTyping(message, "It helped him see the underlying causes of fiscal policy and it's effect on the economy.", () => {
      bot.reply(message, moneyImg, () => {
        bot.replyWithTyping(message, "It taught him the value of money where it comes from and how to use money to start successful businesses.", () => {
        let text = "Learn about his work or see his bio"
        let quickReplies = [
          {
            type: "text",
            title: "On to his work!",
            payload: "On to his work!"
          },
          {
            type: "text",
            title: "Bio menu",
            payload: "Bio menu"
          }
        ]

        let reply = generator.quickReplies(text, quickReplies)

        bot.replyWithTyping(message, reply)
        })
      })
    })
  })
})

controller.hears(["Learn about his work", "On to his work!", "Work history"], 'message_received', (bot, message) => {
  bot.reply(message, "Kevin is a professional web developer, consultant and entreprenuer.", () => {
    bot.replyWithTyping(message, "He has two years experience in developing single-page web applications. He is adept at using different open source libraries such as Express (Node.js), React.js and Redux.", () => {
      bot.replyWithTyping(message, "He is currently on the look out for opportunies to work with innovative tech companies.", () => {
        let text = "Learn more about his work."
        let quickReplies = [
          {
            type: "text",
            title: "Skills & Expertise",
            payload: "Skills & Expertise"
          },
          {
            type: "text",
            title: "Demo Projects",
            payload: "Demo Projects"
          },
          {
            type: "text",
            title: "Work Interests",
            payload: "Work Interests"
          }
        ]

        let reply = generator.quickReplies(text, quickReplies)

        bot.replyWithTyping(message, reply)
      })
    })
  })
})

controller.hears(["Skills & Expertise"], "message_received", (bot, message) => {
  bot.reply(message, "Kevin's expertise is in front-end development specializing in creating single page application with React.js.", () => {
    bot.replyWithTyping(message, "His other skills are api development with express, node.js and creating interactive chatbots.", () => {
      let text = "Learn more about his work or to menu."
      let quickReplies = [
        {
          type: "text",
          title: "Demo Projects",
          payload: "Demo Projects"
        },
        {
          type: "text",
          title: "Work Interests",
          payload: "Work Interests"
        },
        {
          type: "text",
          title: "See menu",
          payload: "See menu"
        }
      ]

      let reply = generator.quickReplies(text, quickReplies)

      bot.replyWithTyping(message, reply)
    })
  })
})

controller.hears(["Work Interests"], "message_received", (bot, message) => {
  bot.reply(message, "Kevin is interested in solving business problems via single-page applications or innovative chatbots.", () => {
    let text = "Learn more about his work or go back to menu."
    let quickReplies = [
      {
        type: "text",
        title: "Skills & Expertise",
        payload: "Skills & Expertise"
      },
      {
        type: "text",
        title: "Demo Projects",
        payload: "Demo Projects"
      },
      {
        type: "text",
        title: "See menu",
        payload: "See menu"
      }
    ]

    let reply = generator.quickReplies(text, quickReplies)

    bot.replyWithTyping(message, reply)
  })
})


controller.hears(["Demo Projects", "See his works"], "message_received", (bot, message) => {
  sendDemoProjects(bot, message)
})

controller.hears(["Leave a message", "Send him a msg"], "message_received", (bot, message) => {
  sendReplyToLeaveAMessage(bot, message)
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

  if (message.payload === 'projects') sendDemoProjects(bot, message)

  if (message.payload === 'location') sendCurrentLocation(bot, message)

  if (message.payload === 'live chat') sendLiveChatInstruction(bot, message)

  if (message.payload === 'message') sendReplyToLeaveAMessage(bot, message)

  if (message.payload === 'meeting') sendBookAMeeting(bot, message)

  if (message.payload === 'no thanks, to bot') sendReplyToNothanks(bot, message)

  if (message.payload === 'work') sendDemoProjects(bot, message)

  if (message.payload === 'home menu') sendGenericMenu(bot, message)

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
