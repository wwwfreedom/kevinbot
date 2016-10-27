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
      console.log(event.postback.payload)
      if (event.postback.payload === 'USER_DEFINED_PAYLOAD') {
        sendWelcomeMessage(sender)
        continue
      }

      if (event.postback.payload === 'learn about him') {
        sendInfoAboutMe(sender)
      }

      if (event.postback.payload === 'get my own bot') {
        sendTextMessage(sender, "getting you a bot soon, you will be the first ...")
      }

      if (event.postback.payload === 'bio') {
        sendBiographyQuickReplies(sender)
      }

      if (event.postback.payload === 'projects') {
        sendTextMessage(sender, "going to projects")
      }
    }

    if (event.message && event.message.text) {
      let text = event.message.text
      if (text === 'Generic') {
        sendGenericMessage(sender)
        continue
      }

      if (text === 'See menu') {
        sendHomeMenu(sender)
        continue
      }

      function sendTypingOn(sender) {
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
            recipient: {id:sender},
            sender_action: "typing_on",
          }
        }, function(error, response, body) {
          if (error) {
            console.log('Error sending messages: ', error)
          } else if (response.body.error) {
            console.log('Error: ', response.body.error)
          }
        })
      }

      function sendTypingOff(sender) {
        request({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
            recipient: {id:sender},
            sender_action: "typing_off",
          }
        }, function(error, response, body) {
          if (error) {
            console.log('Error sending messages: ', error)
          } else if (response.body.error) {
            console.log('Error: ', response.body.error)
          }
        })
      }

      if (text === 'Life story') {
        /* var a = ["hello", "typing", "world", "typing", "it's working"] //my result is a array
         * function sendTextMessages(sender, text, i) {
         *   if (i < text.length) {
         *     if (text[i] === 'typing') {
         *       sendTypingOn(sender)
         *       setTimeout(() => {
         *         sendTypingOff(sender)
         *       }, 300)
         *       sendTextMessage(sender, text, i+1)
         *     }
         *     sendTypingOn(sender)
         *     request({
         *       url: 'https://graph.facebook.com/v2.6/me/messages',
         *       qs: {access_token:token},
         *       method: 'POST',
         *       json: {
         *         recipient: {id:sender},
         *         message: {text:text[i]},
         *       }
         *     }, function(error, response, body) {
         *       if (error) {
         *         console.log('Error sending messages: ', error)
         *       } else if (response.body.error) {
         *         console.log('Error: ', response.body.error)
         *       }
         *       sendTypingOff(sender)
         *       sendTextMessages(sender, text, i+1)
         *     })
         *   } else return
         * }
         * sendTextMessages(sender, a, 0) //OK. It works for me :)*/
        var queue = [];
        var queueProcessing = false;

        function queueRequest(request) {
          queue.push(request);
          if (queueProcessing) {
            return;
          }
          queueProcessing = true;
          processQueue();
        }

        function processQueue() {
          if (queue.length == 0) {
            queueProcessing = false;
            return;
          }
          var currentRequest = queue.shift();
          if (currentRequest.json.sender_action) {
            console.log(currentRequest.json)
            request(currentRequest, function(error, response, body) {
              if (error || response.body.error) {
                console.log("Error sending messages!");
              }
              processQueue();
            });
          } else {
            request(currentRequest, function(error, response, body) {
              if (error || response.body.error) {
                console.log("Error sending messages!");
              }
              setTimeout(() => {
                processQueue();
              }, 1000)
            });
          }
        }

        queueRequest({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
            recipient: {id:sender},
            message: {text: "hello"},
          }
        })

        queueRequest({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
            recipient: {id:sender},
            sender_action: "typing_on"
          }
        })

        queueRequest({
          url: 'https://graph.facebook.com/v2.6/me/messages',
          qs: {access_token:token},
          method: 'POST',
          json: {
            recipient: {id:sender},
            message: {text: "world"},
          }
        })
        /* sendTextMessage(sender, "hello")
         * sendTypingOn(sender)
         * sendTypingOff(sender)
         * sendTextMessage(sender, "world")*/
        /* sendTextMessage(sender, "Once upon a time there was a boy named Kevin who was born into a restrictive communist country with little opportunity./nEvery day, his mother would encourage him to stay curious and study hard while she tries to find a way to migrate her family to a better place./nOne day, in an act of kindess, Kevin's grandpa who was living in Australia applied to sponsor Kevin's and his family to migrate to Australia./n Because of that, Kevin was able to grow up in Australia. A land of the free and boundless opportunity. However, there was a difficult period where language barrier and cultural differences threaten to derails Kevin's plan to become the first in his family to graduate from university")*/
        continue
      }
      /* sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))*/
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

function sendBiographyQuickReplies(sender) {
  let text = "Do you want to here his whole life story or just skip to a certain thing?"
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

  sendQuickReplies(sender, quickReplies, text, token)

}

function sendHomeMenu(sender) {
  let messageData = {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "About me",
            "image_url": "https://randomuser.me/api/portraits/lego/5.jpg",
            "subtitle": "Choose an option below",
            "buttons": [
              {
                "type": "postback",
                "title": "Biography",
                "payload": "bio"
              },
              {
                "type": "postback",
                "title": "Stuffs I've made",
                "payload": "projects"
              },
              {
                "type": "postback",
                "title": "See my location",
                "payload": "location"
              }
            ]
          },

          {
            "title": "Connect With Me",
            "image_url": "https://upload.wikimedia.org/wikipedia/en/5/51/IMessage_Icon.png",
            "subtitle": "Choose an option below",
            "buttons": [
              {
                "type": "postback",
                "title": "Live chat",
                "payload": "live chat"
              },
              {
                "type": "postback",
                "title": "Leave a message",
                "payload": "message"
              },
              {
                "type": "postback",
                "title": "Book a meeting",
                "payload": "meeting"
              }
            ]
          },

          {
            "title": "My Social Stuff",
            "image_url": "http://cdn.business2community.com/wp-content/uploads/2016/07/social34.jpg",
            "subtitle": "Choose an option below",
            "buttons": [
              {
                "type": "postback",
                "title": "Reading",
                "payload": "reading"
              },
              {
                "type": "postback",
                "title": "Listening",
                "payload": "listening"
              }
            ]
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

function sendQuickReplies(sender, replies, text, token) {
  let quickReplies = replies.map((reply) => {
    return {
      "content_type": reply.type,
      "title": reply.title,
      "payload": reply.payload
    }
  })

  let messageData = {
    "text": text,
    "quick_replies": quickReplies
  }

  sendToFacebook(token, sender, messageData)
}

function sendToFacebook(token, sender, messageData) {
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

  sendQuickReplies(sender, quickReplies, text, token)
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
