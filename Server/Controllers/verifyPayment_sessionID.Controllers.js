import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv"
import { Cart } from "../model/Cart.js";


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const verify_session = async ( req , res ) => {
   try {
     const session = await stripe.checkout.sessions.retrieve(req.params.session_id);
     const userId = req.user.userID;
 
     if(session.payment_status === "paid"){

        const cart = await Cart.findOne({user:userId}).populate("items.product","title price stock images")

        if(!cart){
            return res.status(404).json({message:"Cart is Empty!"})
        }

        for(const items of cart.items){
            const product = items.product;

            if(product && product.stock >= items.quantity){
                product.stock -= items.quantity
                await product.save()
            }else{
                console.log(`⚠️ Not enough stock for ${product?.title}`);
            }
        }
        
        await Cart.findOneAndUpdate({user:userId},{$set:{items:[]}})

        return res.json({ success: true, session });

     }else {
       return res.json({ success: false });
     }
   } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, error: error.message });
   }
}