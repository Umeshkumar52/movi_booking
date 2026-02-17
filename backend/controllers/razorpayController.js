import orderSchema from "../models/payments/order.js";
import payments from "../models/payments/orderPayment.js";
import razorpay from "../config/razorpay.js";
import crypto from "node:crypto";

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // ₹ to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    await orderSchema.create({
      ...order,
      razorpay_order_id:order.id
    });
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_SECRET_ID || "m5sajveyb381lTTUlYEKL8wq",
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
      const { amount, currency, status, receipt, method, description } =
        paymentDetails;
      const { _id } = req.user;
      await payments.create({
        user: _id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount,
        currency,
        status,
        receipt,
        method,
        description,
      });
      res.status(200).json({ message: "Payment Successfull" });
    } else {
      res.status(400).json({
        message: "Failed to verify payment",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Failed to verify payment",
    });
  }
};

export const paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    await orderSchema.updateOne({razorpay_order_id},{$set:{status:"failed"}})
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create order",
    });
  }
};

