// models/Theater.js

import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  row: { type: String, required: true },      // A, B, C
  number: { type: Number, required: true },   // 1,2,3
  type: {
    type: String,
    enum: ["REGULAR", "VIP", "COUPLE"],
    default: "REGULAR"
  }
}, { _id: false });

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  screenNumber: { type: Number, required: true },

  totalRows: Number,
  seatsPerRow: Number,

  layout: [seatSchema],   // complete seat map

}, { timestamps: true });

export default mongoose.model("Theater", theaterSchema);
