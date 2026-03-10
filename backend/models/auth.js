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
    enum: ["admin", "user","subAdmin"],
    default: "user",
  },
  googleId:String,
  subscription: {
    Id: String,
    ExpireAt: Date,
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
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
registerSchema.index({
  Email:1,
  role:1,
  FullName:1
})

export default mongoose.model("user", registerSchema);
