var menu = [
  {
    title: "About me",
    image_url: "https://randomuser.me/api/portraits/lego/5.jpg",
    subtitle: "Choose an option below",
    buttons: [
      {
        type: "postback",
        title: "Biography",
        payload: "bio"
      },
      {
        type: "postback",
        title: "Stuffs I've made",
        payload: "projects"
      },
      {
        type: "postback",
        title: "See my location",
        payload: "location"
      }
    ]
  },

  {
    title: "Connect With Me",
    image_url: "https://upload.wikimedia.org/wikipedia/en/5/51/IMessage_Icon.png",
    subtitle: "Choose an option below",
    buttons: [
      {
        type: "postback",
        title: "Live chat",
        payload: "live chat"
      },
      {
        type: "postback",
        title: "Leave a message",
        payload: "message"
      },
      {
        type: "postback",
        title: "Book a meeting",
        payload: "meeting"
      }
    ]
  }
]

module.exports = menu
