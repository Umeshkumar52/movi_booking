import mongoose from "mongoose";
const seatSchema = new mongoose.Schema(
{
    movi_id:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "movie",
    },
    seatNumber:String,
    isBooked:Boolean,
    row:String,
    col:Number,
    totalSeats:Number,
    razorpay_payment_id:String,
    bookedBy:{
             type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            default:null
        },
}
)
seatSchema.index({
    row:1,col:1
})
export default mongoose.model("seats", seatSchema);