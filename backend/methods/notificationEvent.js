import sendPushNotification from "../config/sendPushNotification.js";
import user from '../models/auth.js'
// create order to push notification
export const notificationEvent = async (title, body, recieverId) => {
  // get receiver fmcToken
  const { fcmToken } = await user.findById(recieverId);
  if (fcmToken) {
    await sendPushNotification(
      fcmToken || "",
      title || "Order Placed ✅",
      body || "Your order has been placed successfully",
    );
  }
 
}  
