import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();
import  mongoose from "mongoose";
import connectDB from "./config/db.js";

// Connect to MongoDB
connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
