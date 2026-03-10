import mongoose from 'mongoose'

const database=async()=>{
   try{
     await mongoose.connect(process.env.MONGOOSE_URL)
     console.log("database is connnected")
   }
   catch(err){
   console.error("Failed to connect database:", err)
   process.exit(1)
   }
}
export default database