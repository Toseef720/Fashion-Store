import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",   // Frontend ka URL
  credentials: true,                 // Cookies/Auth headers allow karo
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.get("/hello", (req, res) => {
  console.log("API is running...");
  res.send("Hello from the backend!");
});


app.use("/api/users", routes);
export default app;