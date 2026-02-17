import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
      unique: true,
    },

    razorpay_payment_id: {
      type: String,
    },

    razorpay_signature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "success","captured", "failed", "refunded"],
      default: "created",
    },

    receipt: {
      type: String,
    },

    method: {
      type: String,
    },

    description: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
