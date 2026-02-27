import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import instance from "./axiosInstance";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ,
  storageBucket:import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ,
  messagingSenderId:import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ,
  appId:import.meta.env.VITE_FIREBASE_API_ID ,
  measurementId:import.meta.env.VITE_FIREBASE_MEASUREMENT_ID 
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


export const generateToken = async (registration) => {
  try {
    const token = await getToken(messaging, {
      vapidKey:import.meta.env.VITE_VAPID_KAY,
        serviceWorkerRegistration: registration
    });
    
    // save token in uswer database
    const response = await instance.patch("/auth/update/fcmToken", {fcmToken:token});
 

    return token;
  } catch (error) {
    console.error("Failed to generate or save FCM token:", error);
  }
};
