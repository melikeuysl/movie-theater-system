import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is running 🚀" });
});


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
     console.log(`✅ Server is running on port ${PORT}`);
    });
});