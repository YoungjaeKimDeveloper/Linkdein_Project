import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/connectDB.js";
import cookieParser from "cookie-parser";
// Routes
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

dotenv.config({ path: "/Users/youngjaekim/Desktop/Linkedin_Clone/.env" });

const PORT = process.env.PORT;
const app = express();
app.use(express.json()); // parse JSON reques body
app.use(cookieParser());

// V1 = Version
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/notification", notificationRoutes);

app.listen(PORT, () => {
  console.info(`Server is Running In ${PORT}`);
  connectDB();
});
