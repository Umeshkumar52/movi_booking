import mongoose from "mongoose";

const registerSchema = new mongoose.Schema({
  FullName: {
    type: String,
    require: true,
  },
  Email: {
    type: String,
    require: true,
    unique: true,
  },
  Password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  subscription: {
    Id: String,
    Expiry: Date,
    Status: {
      type: String,
      enum: ["active", "expire"],
      default: "expire",
    },
  },
  fcmToken: {
    type: String,
    default: null,
  },
  bookedMovi: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "movies",
    },
  ],
});

export default mongoose.model("user", registerSchema);
