{
  let askFlavor = function(response, convo) {
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
  }
  let askSize = function(response, convo) {
    console.log(response, "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    let text = "1. In the upcoming 🇺🇸 election, if he could vote he'll be voting for:"
    let quickReplies = [
      {
        type: "text",
        title: "Hillary Clinton",
      },
      {
        type: "text",
        title: "Donald Trump",
      },
      {
        type: "text",
        title: "Someone else",
      }
    ]

    let reply = generateQuickReplies(text, quickReplies)

    convo.ask(reply, function(response, convo) {
      convo.say(response)
      console.log(response, "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      askWhereDeliver(response, convo)
      convo.next()
    })
  }
  let askWhereDeliver = function(response, convo) {
    convo.ask("So where do you want it delivered?", function(response, convo) {
      convo.say("Ok! Goodbye.")
      convo.next()
    })
  }

  bot.startConversation(message, askFlavor)

  let count = 0

  const askSecondQuestion = (response, convo) => {
    let text = "1. In the upcoming 🇺🇸 election, if he could vote he'll be voting for:"
    let quickReplies = [
      {
        type: "text",
        title: "Hillary Clinton",
      },
      {
        type: "text",
        title: "Donald Trump",
      },
      {
        type: "text",
        title: "Someone else",
      }
    ]

    let reply = generateQuickReplies(text, quickReplies)

    convo.ask(reply, (response, convo) => {
      convo.say('yolo')
      convo.next()
    })
  }

  const askFirstQuestion = (response, convo) => {
    let text = "1. In the upcoming 🇺🇸 election, if he could vote he'll be voting for:"
    let quickReplies = [
      {
        type: "text",
        title: "Hillary Clinton",
      },
      {
        type: "text",
        title: "Donald Trump",
      },
      {
        type: "text",
        title: "Someone else",
      }
    ]

    let reply = generateQuickReplies(text, quickReplies)

    convo.ask(reply, (response, convo) => {
      convo.say(response)

      convo.say('test')
      convo.next()
    })
  }

  function askToStart(response, convo) {
    let text = "Ok cool. Let's see how well you know him..."
    let quickReplies = [
      {
        type: "text",
        title: "Start the quiz!",
        payload: "Start the quiz!"
      },
    ]

    let reply = generateQuickReplies(text, quickReplies)

    convo.ask(reply, (response, convo) => {
      askFirstQuestion(response, convo)
      convo.next()
    })
  }

  bot.startConversation(message, (err, convo) => {
    let text = "Ok cool. Let's see how well you know him..."
    let quickReplies = [
      {
        type: "text",
        title: "Start the quiz!",
        payload: "Start the quiz!"
      },
    ]

    let reply = generateQuickReplies(text, quickReplies)

    convo.ask(reply, (response, convo) => {
      askFirstQuestion(response, convo)
      convo.next()
    })
  })
}
