
import admin from "./firebase.js";

export default async function sendPushNotification (fcmToken, title, body){
  try {
    console.log("fcmToken",title,body,fcmToken)
    const message = {
      token: fcmToken,
     webpush:{ data: {
        title,
        body,
      }}
    };
     console.log(message)
    await admin.messaging().send(message);
  } catch (error) {
     throw new Error("Failed to send notification")
  }
};