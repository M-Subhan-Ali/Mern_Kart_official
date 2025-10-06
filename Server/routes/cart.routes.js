import { Router } from "express";
import {
  AddToCart,
  Clear_Cart,
  Getcart,
  RemoveFromCart,
  UpdateCart,
} from "../Controllers/cart.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";

const route = Router();

route.post("/add_to_cart", privateRoute, AddToCart);

route.get("/fetch_cart_items", privateRoute, Getcart);

route.post("/update_item", privateRoute, UpdateCart);

route.post("/remove_item", privateRoute, RemoveFromCart);

route.post("/clear_cart", privateRoute, Clear_Cart);

export { route as CartRoute };
