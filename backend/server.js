import express from "express";
import dotenv from "dotenv";
// Routes
import authRoutes from "./routes/auth.routes.js";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Clone/.env" });

const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // parse JSON reques body
app.use(cookieParser());

// V1 = Version
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.info(`Server is Running In ${PORT}`);
  connectDB();
});
