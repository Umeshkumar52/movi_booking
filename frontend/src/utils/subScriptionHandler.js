import instance from '../utils/axiosInstance'
import { AuthContext } from "../context/AuthProvider";
import { useContext } from 'react';
export const subscriptionHandler = async (setPayment) => {

  const { data } = await instance.post("/payment/subscription-create");

 const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_nQWGOqxTtkbLzt",
  subscription_id: data.message.id,
  name:data.message.message|| "Your App Name",
  description:data.message.description|| "Premium Plan",
  handler: async function (response) {
     console.log(response)
    // After payment success
    await instance.post("payment/subscription-verify",{
      subscriptionId:data.message.id,
    });
   
    // window.location.reload()
   setPayment(prev=>!prev)
    // alert("Subscription Successful");
  }
};
  const rzp = new window.Razorpay(options);
  rzp.open();
};
