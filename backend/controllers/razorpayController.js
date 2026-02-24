import orderSchema from "../models/payments/order.js";
import payments from "../models/payments/orderPayment.js";
import razorpay from "../config/razorpay.js";
import crypto from "node:crypto";
import user from "../models/auth.js";
import generateToken from "../middilwares/generateToken.js";

const accessOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 30 * 60 * 1000,
};
const refreshOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 15 * 24 * 60 * 60 * 1000,
};

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
      razorpay_order_id: order.id,
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
    await orderSchema.updateOne(
      { razorpay_order_id },
      { $set: { status: "failed" } },
    );
    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create order",
    });
  }
};

export const createSubscription = async (req, res) => {
  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
      total_count: 2,
    });
      console.log(subscription)
    // Save subscription id temporarily
    await user.findByIdAndUpdate(req.user._id, {
      $set: {
        "subscription.Id": subscription.id,
        "subscription.Status": subscription.status || "created",
      },
    });

    res.status(200).json({ message: subscription });
  } catch (err) {
    console.log("errores", err);
    res.status(501).json({ message: "Failed to create subscription" });
  }
};

export const verifySubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.body;

    const subscription = await razorpay.subscriptions.fetch(subscriptionId);
    // console.log(subscription)
    if (subscription) {
      // Update user in DB
      const userData = await user.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            "subscription.Id": subscriptionId,
            "subscription.Status": "active",
          },
        },
        { new: true, runValidators: true },
      );
      const { accessToken, refreshToken } = generateToken({
        FullName: userData.FullName,
        _id: userData._id,
        role: userData.role,
        subscription: userData.subscription?.Status,
      });
      res.cookie("refreshToken", refreshToken, refreshOptions);
      res.cookie("accessToken", accessToken, accessOptions);
      return res.status(200).json({
        success: true,
        message: "Subscription Activated",
      });
    }
    res.status(400).json({
      success: false,
      message: "Unable to verify",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to verify",
    });
  }
};
