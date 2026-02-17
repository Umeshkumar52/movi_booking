// importScripts(
//   "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
// );
// importScripts(
//   "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
// );
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:"AIzaSyBuL12lKlFZnDLWYhROG0jE7DDZSpRxKSA",
  authDomain: "movibooking.firebaseapp.com",
  projectId: "movibooking",
  messagingSenderId:  "193904085713",
  appId: "1:193904085713:web:e18f8bb913357f049353f0"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload){
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
  });
});
