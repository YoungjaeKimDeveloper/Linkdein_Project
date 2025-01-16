import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
// Routes
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/user.routes.js";
dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Clone/.env" });

const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // parse JSON reques body
app.use(cookieParser());

// V1 = Version
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);

app.listen(PORT, () => {
  console.info(`Server is Running In ${PORT}`);
  connectDB();
});
