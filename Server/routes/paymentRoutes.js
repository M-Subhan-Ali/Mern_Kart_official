import { Router } from "express";
import { privateRoute } from "../middlewares/authmiddleware.js";
import { createCheckoutSession } from "../Controllers/paymentController.js";

const route = Router();

route.post("/create-checkout-session", privateRoute, createCheckoutSession)

export {route as paymentRouter}