import { onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { toast } from "react-toastify";

export const listenForegroundNotifications = () => {
  onMessage(messaging, (payload) => {
    // console.log("notifaction",payload)
    const { title, body } = payload?.data||payload.notification;
    if (Notification.permission === "granted" ) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg) {
          reg.showNotification(title,{ body:body });
        }
      }); 
    }
    // toast.success(title);
  });
};
