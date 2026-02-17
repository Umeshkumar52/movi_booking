
import Razorpay from 'razorpay'
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID||"rzp_test_nQWGOqxTtkbLzt",
  key_secret: process.env.RAZORPAY_SECRET_ID||"m5sajveyb381lTTUlYEKL8wq",
});

export default razorpayInstance;
