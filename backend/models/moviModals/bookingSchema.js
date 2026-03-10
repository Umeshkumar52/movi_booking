// models/Booking.js

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true
  },

  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
    required: true
  },

  seats: [String],   // ["A3", "A4"]

  totalAmount: { type: Number, required: true },
  razorpay_payment_id:{
    type:String
  },
   razorpay_order_id:{
    type:String,
    require:true
  },
  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING"
  },

  bookingStatus: {
    type: String,
    enum: ["CONFIRMED","PENDING", "CANCELLED"],
    default: "CONFIRMED"
  }

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
