import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use(cors());
//baad me cors ko front wla host de denge with credentials
app.get("/hello", (req, res) => {
  console.log("API is running...");
  res.send("Hello from the backend!");
});


app.use("/api/users", routes);
export default app;