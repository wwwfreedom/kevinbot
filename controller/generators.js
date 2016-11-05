'use strict'

module.exports = {
  buttonTemplate: function (text, buttons) {
    let buttonArr = buttons.map((button) => {
      if (button.type === 'postback') {
        return {
          "type": button.type,
          "title": button.title,
          "payload": button.payload
        }
      } else if (button.type === 'web_url') {
        return {
          type: button.type,
          url: button.url,
          title: button.title,
          webview_height_ratio: button.webview_height_ratio
        }
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
  },

  quickReplies: function(text, replies) {
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
  },

  genericTemplate: (elements) => ({
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: elements
      }
    }
  }),

  imageTemplate: (link) => ({
    attachment: {
      type: 'image',
      payload: {
        url: link
      }
    }
  })
}
