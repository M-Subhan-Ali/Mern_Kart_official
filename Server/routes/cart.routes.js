import { Router } from "express";
import { AddToCart, Getcart } from "../Controllers/cart.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";

const route = Router();

route.post("/add_to_cart", privateRoute, AddToCart);

route.get("/fetch_cart", privateRoute, Getcart);

export { route as CartRoute };
