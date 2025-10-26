import Stripe from "stripe";
import dotenv from "dotenv";
import { Cart } from "../model/Cart.js";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Stripe Webhook Controller
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    // ✅ Verify Stripe signature using your webhook secret
    event = stripe.webhooks.constructEvent(
      req.body, // must be raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ Handle different event types
  try {
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("✅ Payment successful for:", session.customer_email);

        // Optionally clear the user's cart after successful payment
        if (session.customer_email) {
          await Cart.findOneAndUpdate(
            { userEmail: session.customer_email },
            { $set: { items: [] } }
          );
          console.log("🧹 Cart cleared for user:", session.customer_email);
        }

        break;

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", event.data.object);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Respond to Stripe to confirm receipt
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("⚠️ Webhook processing error:", error);
    res.status(500).send("Server error");
  }
};
