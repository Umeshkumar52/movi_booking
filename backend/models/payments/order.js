import mongoose from 'mongoose'

const orderSchema=new mongoose.Schema({
   amount:{
    type:Number,
    require:true
   },
   currency:{
     type:String,
    require:true
   },
   receipt:{
     type:String,
     default: "receipt_" + Date.now()
   },
   razorpay_order_id:String,
   show_id:{
     type:mongoose.Schema.Types.ObjectId,
       ref:"movies"
   },
   seats:Array,
   status:String
})
export default mongoose.model("order",orderSchema)