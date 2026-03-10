import orderSchema from "../models/payments/order.js";
import payments from "../models/payments/orderPayment.js";
import razorpay from "../config/razorpay.js";
import crypto from "node:crypto";
import user from "../models/auth.js";
import generateToken from "../middilwares/generateToken.js";
import Booking from '../models/moviModals/bookingSchema.js'
import { parseTemplate } from "../utils/parseTemplate.js";
import bookingSchema from "../models/moviModals/bookingSchema.js";
import sendEmail from "../utils/sendEmail.js";
// import { emailQueue } from "../utils/emailQueue.js";
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
      console.log("Payment verified and recorded in DB");

      res.status(200).json({ message: "Payment Successfull" });
    } else {
      res.status(400).json({
        message: "Failed to verify payment",
      });
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: "Failed to verify payment",
    });
  }
};

export const webhookVerification= async (req, res) => {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

      const signature = req.headers["x-razorpay-signature"];

      const generatedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(req.body)
        .digest("hex");

      if (generatedSignature !== signature) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      const event = JSON.parse(req.body);

      console.log("Webhook Event:", event.event);

      // 🎯 Payment Success
      if (event.event === "payment.captured") {
        const payment = event.payload.payment.entity;

        const booking = await Booking.findOne({
          razorpay_order_id: payment.order_id,
        }).populate("userId").populate({
          path: "showId",
          populate: [
            { path: "movieId", select: "title" },
            { path: "theaterId", select: "name" }
          ]
        });

        if (booking && booking.bookingStatus !== "CONFIRMED") {
          booking.bookingStatus = "CONFIRMED";
          booking.razorpay_payment_id = payment.id;
          booking.paymentStatus="SUCCESS"
          await booking.save();

          console.log("🎉 Booking Confirmed");

          if (booking.userId?.Email) {
            const html = parseTemplate("BookingSeat", { 
               FullName: booking.userId.FullName,
               _id: booking.userId._id,
               booking_id: booking._id,
               updatedAt: new Date(booking.updatedAt).toLocaleString(),
               bookingStatus: booking.bookingStatus,
               paymentStatus: booking.paymentStatus,
               totalAmount: booking.totalAmount,
               movieName: booking.showId?.movieId?.title || "Movie",
               theatre: booking.showId?.theaterId?.name || "Theatre",
               seats: booking.seats,
               razorpay_payment_id: payment.id, 
            });

            await sendEmail({
               message:"",
               email: booking.userId.Email,
               subject: "FilmNest - Movi Booking",
               html,
            });
          }
        }
      }

      // ❌ Payment Failed
      if (event.event === "payment.failed") {
        const payment = event.payload.payment.entity;

        await Booking.updateOne(
          { razorpay_order_id: payment.order_id },
          { $set: { bookingStatus: "FAILED", paymentStatus: "FAILED" } }
        );
      }
      
      res.status(200).json({ status: "ok" });
    } catch (error) {
      console.error("Webhook Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  }
export const failedPayment = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    await orderSchema.updateOne(
      { razorpay_order_id },
      { $set: { status: "failed" } },
    );
    res.status(200).json({message:"Payment failed"});
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
    const expireAt=new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
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
            "subscription.ExpireAt":expireAt
          },
        },
        { new: true, runValidators: true },
      );
      const { accessToken, refreshToken } = generateToken({
        FullName: userData.FullName,
        _id: userData._id,
        role: userData.role,
        subscription: userData.subscription
      });
      res.cookie("refreshToken", refreshToken, refreshOptions);
      res.cookie("accessToken", accessToken, accessOptions);
      return res.status(200).json({
        success: true,
        message:userData.subscription,
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
