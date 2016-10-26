'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
  res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong token')
})

app.post('/webhook/', function (req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++) {
    let event = req.body.entry[0].messaging[i]
    let sender = event.sender.id
    if (event.postback) {
      if (event.postback.payload === 'USER_DEFINED_PAYLOAD') {
        sendWelcomeMessage(sender)
        continue
      }

      if (event.postback.payload === 'learn about him') {
        sendInfoAboutMe(sender)
      }

      if (event.postback.payload === 'get my own bot') {
        sendTextMessage(sender, "getting you a bot soon wait up ...")
      }

      if (event.postback.payload === 'home menu') {
        sendTextMessage(sender, "going to home menu")
      }
    }

    if (event.message && event.message.text) {
      let text = event.message.text
      if (text === 'Generic') {
        sendGenericMessage(sender)
        continue
      }
      sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
    }

  }

  res.sendStatus(200)
})

const token = process.env.FB_PAGE_ACCESS_TOKEN

function sendTextMessage(sender, text) {
  let messageData = { text:text }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendInfoAboutMe(sender) {
  let messageData = {
    "text": "You should know, I can share a ton of stuff about Kevin. 📚 You can dig into his background, projects he's done, and even see what he’s reading.",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "See the home menu",
        "payload": "home menu"
      },
      {
        "content_type": "text",
        "title": "Gimme his story",
        "payload": "story"
      },
      {
        "content_type": "text",
        "title": "Take his quiz!",
        "payload": "quiz"
      },
      {
        "content_type": "text",
        "title": "His company xinchaobot",
        "payload": "company"
      },
      {
        "content_type": "text",
        "title": "Send him a msg 💬",
        "payload": "msg"
      }
    ]
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendWelcomeMessage(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": `Hi! I’m Kevin's personal bot 🤖. Are you wanting to connect with him or get your own bot that people can talk to?`,
        "buttons": [
          {
            "type": "postback",
            "title": "Learn about him 👨🏻",
            "payload": "learn about him"
          },
          {
            "type": "postback",
            "title": "Get your own bot 🤖",
            "payload": "get my own bot"
          }
        ]
      }
    }
  }

  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

function sendGenericMessage(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [{
          "title": "First card",
          "subtitle": "Element #1 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
          "buttons": [{
            "type": "web_url",
            "url": "https://www.messenger.com",
            "title": "web url"
          }, {
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for first element in a generic bubble",
          }],
        }, {
          "title": "Second card",
          "subtitle": "Element #2 of an hscroll",
          "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
          "buttons": [{
            "type": "postback",
            "title": "Postback",
            "payload": "Payload for second element in a generic bubble",
          }],
        }]
      }
    }
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending messages: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}


// Spin up the server
app.listen(app.get('port'), function() {
  console.log('running on port', app.get('port'))
})

/* curl -X POST -H "Content-Type: application/json" -d '{
 *    "setting_type":"greeting",
 *    "greeting":{
 *      "text":"Hi {{user_first_name}}, I am the personal bot of Kevin, a web developer from Melbourne. Press the get started button to begin."
 *    }
 *  }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAQle8UCzGwBANste5znw00stMNIYIygo7aZBGXUSY2fAlgEU7YGDF2O9ZCBLs0vHh7gSvp1oo0s849UaXY9J6nzbSsmTYrHaFRZBZBRcyGjEkTonhllsSCfOkRIp2HPHOG34PzaXEK8igY5Vo3SZBv69cUCL5SboZCYOQCHgYugZDZD"
 *
 *
 * curl -X POST -H "Content-Type: application/json" -d '{
 *    "setting_type":"call_to_actions",
 *    "thread_state": "new_thread",
 *    "call_to_actions": [
 * {
 *   "payload": "USER_DEFINED_PAYLOAD"
 * }
 * ]
 *  }' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAQle8UCzGwBANste5znw00stMNIYIygo7aZBGXUSY2fAlgEU7YGDF2O9ZCBLs0vHh7gSvp1oo0s849UaXY9J6nzbSsmTYrHaFRZBZBRcyGjEkTonhllsSCfOkRIp2HPHOG34PzaXEK8igY5Vo3SZBv69cUCL5SboZCYOQCHgYugZDZD"*/
