import Stripe from "stripe";
import dotenv from "dotenv";
import { Cart } from "../model/Cart.js";
import { Product } from "../model/Product.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user.userID;

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Your cart is empty!" });
    }

    // Check stock
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        return res
          .status(400)
          .json({ error: `Not enough stock for ${item.product.title}` });
      }
    }

    // Convert cart items into Stripe line items
    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.title,
          images: item.product.images?.length ? [item.product.images[0]] : [],
        },
        unit_amount: Math.round(item.product.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:3000/Success",
      cancel_url: "http://localhost:3000/Cancel",
      customer_email: req.user.email, 
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({
      error: "Failed to create checkout session",
      details: error.message,
    });
  }
};
