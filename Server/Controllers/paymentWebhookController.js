import Stripe from "stripe";
import dotenv from "dotenv";
import { Cart } from "../model/Cart.js";
import { User } from "../model/user.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // ✅ Verify Stripe signature (to ensure event really came from Stripe)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.client_reference_id; // ✅ You added this when creating the session

        console.log("✅ Payment completed for user ID:", userId);

        if (userId) {
          // Clear the user's cart
          await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } }
          );

          console.log("🧹 Cart cleared for user:", userId);
        } else {
          console.log("⚠️ No user ID found in session");
        }
        break;
      }

      case "payment_intent.payment_failed":
        console.log("❌ Payment failed:", event.data.object);
        break;

      default:
        console.log(`⚠️ Unhandled event type ${event.type}`);
    }

    // Always respond with 200 so Stripe knows you received the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("⚠️ Webhook processing error:", error);
    res.status(500).send("Server error");
  }
};
