import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./ConfigDatabase/mongoDb.js";
// import { configDotenv } from "dotenv";
import { AuthRouter } from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.routes.js";
import { ProductRoute } from "./routes/products.routes.js";
import { CartRoute } from "./routes/cart.routes.js";
import { paymentRouter } from "./routes/paymentRoutes.js";
import { webhookRouter } from "./routes/paymentWebhookRoute.js";



const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use("/api/payment", webhookRouter);


app.use(cookieParser());
app.use(
  cors({
    origin: process.env.frontendURL,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Hello from the Subhan server!");
});

app.use("/authentication", AuthRouter);
app.use("/user", UserRouter);
app.use("/product", ProductRoute);
app.use("/cart", CartRoute);
app.use("/api/payment", paymentRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
