import sendPushNotification from "../config/sendPushNotification.js";
import user from '../models/auth.js'
// create order to push notification
export const createOrder = async (req, res) => {
try {
    const { title, body, recieverId } = req.body;
  // get receiver fmcToken
  const { fcmToken } = await user.findById(recieverId);
  if (fcmToken) {
    await sendPushNotification(
      fcmToken || "",
      title || "Order Placed ✅",
      body || "Your order has been placed successfully",
    );
  }
  res.status(200).json({ message: "Notification sent" });
} catch (error) {
  console.log(error)
    res.status(400).json({ message: "failed to send notification" });
}
}  
