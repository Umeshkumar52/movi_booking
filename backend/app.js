import "./env.js";
import "./config/eventEmiter.js"
import express from "express";
import authRoutes from "./routers/authRoutes.js";
import moviesRoutes from "./routers/moviesRoute.js";
import database from "./config/database.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import razorpayRoutes from './routers/razorpayRoutes.js'
import authenticate from "./middilwares/authenticate.js";
import notificationRoutes from './routers/notificationRoutes.js'
import { webhookVerification } from "./controllers/razorpayController.js";

const app = express();
database();
// console.log( process.cwd())
const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('api/v1/payment/webhook/razorpay',  express.raw({ type: "application/json" }),webhookVerification)
app.use(express.json());
app.set("trust proxy",1)
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  }),
);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movies",authenticate,moviesRoutes);
app.use("/api/v1/payment",authenticate, razorpayRoutes);
app.use("/api/v1/notification",notificationRoutes);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);

export default app;
