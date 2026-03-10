// import "./env.js";
// import { Worker } from "bullmq";
// import { connection } from "./config/redis.js";
// import sendEmail from "./utils/sendEmail.js";

// const worker = new Worker(
//   "email",
//   async (job) => {

//     switch (job.name) {
//       case "reset-password-mail":
//         await sendEmail(job.data)
//         break;
       
//         case "booking-mail":
//         await sendEmail(job.data)
//         break;
      
//       default:
//          console.log("Unknown job:", job.name);
//         break;
//     }
//   },
//   { connection }
// );

// worker.on("error", (err) => {
//   console.error("Worker connection error:", err.message);
// });

// worker.on("completed", job => {
//   console.log(`✅ Job completed ${job.id}`);
// });

// worker.on("failed", (job, err) => {
//   console.error(`❌ Job failed ${job.id}`, err);
// });