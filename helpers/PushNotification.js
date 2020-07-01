const fcm = require("fcm-notification");
const fcmFile = require("../medeves-c81fe-firebase-adminsdk.json");
const FCM = new fcm(fcmFile);
module.exports = async (title, body, token) => {
  let message = {
    android: {
      ttl: 3600 * 1000, // 1 hour in milliseconds
      priority: "high",
      notification: {
        title: title,
        body: body,
        icon: "stock_ticker_update",
        color: "#f45342",
        sound: "default",
      },
    },
    token: token,
  };

  await FCM.send(message, function (err, response) {
    if (err) {
      console.log("error found", err);
    } else {
      console.log("response here", response);
    }
  });
};
