import instance from './axiosInstance'
const handlePayment = async (setPayment,amount) => {
  const { data: order } = await instance.post("/payment/create-order", {
    amount: amount
  });
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID||"rzp_test_nQWGOqxTtkbLzt",
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,
// Tickets Confirmed! 🍿 You're all set to watch [Movie Title] tonight at [Time]
    handler: async function (response) {
       await instance.post("/payment/verify", response);
       setPayment(response)
     
    },

    modal: {
      ondismiss: async function () {
        await instance.post("/payment/failed", {
          razorpay_order_id: order.id,
        });
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
export default handlePayment
