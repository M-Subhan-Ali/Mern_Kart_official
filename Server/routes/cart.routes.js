import { Router } from "express";
import { AddToCart } from "../Controllers/cart.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";

const route = Router();

route.post("/add_to_cart", privateRoute, AddToCart);

export { route as CartRoute };
