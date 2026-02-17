import admin from "./firebase.js";

export default async function sendPushNotification (fcmToken, title, body){
  try {
    const message = {
      token: fcmToken,
      data: {
        title,
        body,
      },
      // data: {
      //   click_action: "FLUTTER_NOTIFICATION_CLICK",
      // },
    };
    await admin.messaging().send(message);
  } catch (error) {
     throw new Error("Failed to send notification")
  }
};