import instance from '../utils/axiosInstance'
import { AuthContext } from "../context/AuthProvider";
import { useContext } from 'react';
export const subscriptionHandler = async (setPayment,setUser) => {

  const { data } = await instance.post("/payment/subscription-create");

 const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_nQWGOqxTtkbLzt",
  subscription_id: data.message.id,
  name:data.message.message|| "Your App Name",
  description:data.message.description|| "Premium Plan",
  handler: async function (response) {
    
    // After payment success
   const subData= await instance.post("payment/subscription-verify",{
      subscriptionId:data.message.id,
    });
 console.log(subData)
     setUser((prev) => ({ ...prev, subscription:subData.data.message  }));
   
    // window.location.reload()
   setPayment(prev=>!prev)
    // alert("Subscription Successful");
  }
};
  const rzp = new window.Razorpay(options);
  rzp.open();
};
