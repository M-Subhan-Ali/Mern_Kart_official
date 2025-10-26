import express from "express";
import { handleStripeWebhook } from "../Controllers/paymentWebhookController.js";

const route = express.Router();

// ⚠️ Important: Stripe requires the raw body, so we do NOT use express.json() here
route.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

export { route as webhookRouter };
