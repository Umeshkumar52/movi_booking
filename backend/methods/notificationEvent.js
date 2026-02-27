import sendPushNotification from "../config/sendPushNotification.js";
import user from '../models/auth.js'
// create order to push notification
export const notificationEvent = async (title, body, recieverId) => {
  // get receiver fcmToken
  const userDoc = await user.findById(recieverId);
  if (userDoc && userDoc.fcmToken) {
    await sendPushNotification(
      userDoc.fcmToken,
      title || "Order Placed ✅",
      body || "Your order has been placed successfully",
    );
  }
}  
