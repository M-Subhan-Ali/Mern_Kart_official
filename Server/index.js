import express from "express";
import connectDB from "./ConfigDatabase/mongoDb.js";
import { configDotenv } from "dotenv";
import { AuthRouter } from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { UserRouter } from "./routes/user.routes.js";
import { ProductRoute } from "./routes/products.routes.js";
configDotenv();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.frontendURL,
    credentials: true,
  })
);
app.use(express.json());

connectDB();
app.get("/", (req, res) => {
  console.log("Server is running");
  res.send("Hello from the server!");
});

app.use("/authentication", AuthRouter);
app.use("/user", UserRouter);
app.use("/product", ProductRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
