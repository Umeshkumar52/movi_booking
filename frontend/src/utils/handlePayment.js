import instance from './axiosInstance'
const handlePayment = async (setPayment, amount, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const { data: order } = await instance.post("/payment/create-order", {
      amount: amount
    });
    
    if (setLoading) setLoading(false); // Stop loader to show Razorpay modal

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_nQWGOqxTtkbLzt",
      amount: order.amount,
      currency: order.currency,
      order_id: order.id,
      handler: async function (response) {
         if (setLoading) setLoading(true);
         await instance.post("/payment/verify", response);
         setPayment(response);
      },
      modal: {
        ondismiss: async function () {
          if (setLoading) setLoading(false);
          await instance.post("/payment/failed", {
            razorpay_order_id: order.id,
          });
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (response){
        if (setLoading) setLoading(false); // Disable loader if payment fails
    });
    rzp.open();
  } catch (error) {
    if (setLoading) setLoading(false);
    throw error;
  }
};
export default handlePayment
