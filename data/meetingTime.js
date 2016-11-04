var meetingTime = [
  {
    title: "Pick the time you like to meet Kevin",
    buttons: [
      {
        type: "postback",
        title: "Monday (1pm - 3pm)",
        payload: "monday"
      },
      {
        type: "postback",
        title: "Tuesday (12pm - 3pm)",
        payload: "tuesday"
      },
      {
        type: "postback",
        title: "Wednesday (12pm - 3pm)",
        payload: "wednesday"
      }
    ]
  },

  {
    title: "Pick the time you like to meet Kevin",
    buttons: [
      {
        type: "postback",
        title: "Thursday (1pm - 3pm)",
        payload: "monday"
      },
      {
        type: "postback",
        title: "Friday (12pm - 3pm)",
        payload: "tuesday"
      }
    ]
  }
]

module.exports = meetingTime
