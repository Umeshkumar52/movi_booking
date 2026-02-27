
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey:"AIzaSyBuL12lKlFZnDLWYhROG0jE7DDZSpRxKSA",
//   authDomain: "movibooking.firebaseapp.com",
//   projectId: "movibooking",
//   messagingSenderId:  "193904085713",
//   appId: "1:193904085713:web:e18f8bb913357f049353f0"
// });

// const messaging = firebase.messaging();


// messaging.onBackgroundMessage(function(payload){
//   console.log("[firebase-messaging-sw.js] Received background message: ", payload);
  
//   // Custom logic ONLY for data payloads, as Firebase handles 'notification' payloads automatically
//   // if (payload?.data ||payload?.notification) {
//     const notificationTitle = payload?.data?.title||payload?.notification?.title || "Notification";
//     const notificationOptions = {
//       body: payload.data.body ||payload.notification.body || "You have a new message.",
//     };
//     self.registration.showNotification(notificationTitle, notificationOptions);
//   // }
// });


// *****************************
import { getMessaging } from "firebase/messaging/sw";
import {onBackgroundMessage} from 'firebase/messaging/sw'

const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

