import admin from "../config/firebase.js";
import sendPushNotification from "../config/sendPushNotification.js";
import user from '../models/auth.js'
// create order to push notification
export const createOrder = async (req, res) => {
try {
    const { title, body, recieverId } = req.body;
  // get receiver fcmToken
  const userDoc = await user.findById(recieverId);
    // await sendPushNotification(
    //   userDoc?.fcmToken||"",
    //   title || "Order Placed ✅",
    //   body || "Your order has been placed successfully",
    // );
  
     const message = {
          token: userDoc?.fcmToken||"",
        webpush:{ data: {
            title,
            body,
           
          }}
        };
        
       const data= await admin.messaging().send(message)
      
  res.status(200).json({ message: "Notification sent" });
} catch (error) {
  console.log(error)
    res.status(400).json({ message: "failed to send notification" });
}
}  
