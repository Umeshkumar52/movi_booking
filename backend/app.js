import express from "express";
import dotenv from "dotenv";
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
dotenv.config();
const app = express();
database();

const PORT = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
