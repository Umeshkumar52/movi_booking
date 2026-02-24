// models/Show.js

import mongoose from "mongoose";

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "movies",
    required: true
  },

  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
    required: true
  },

  date: { type: Date, required: true },
  time: { type: String, required: true },

  price: {
    REGULAR: Number,
    VIP: Number,
    COUPLE: Number
  },

  bookedSeats: [String]  // ["A1", "A2"]

}, { timestamps: true });
showSchema.index({
  movieId:1
})

export default mongoose.model("Show", showSchema);
