import { Router } from "express";
import {
  AddToCart,
  Clear_Cart,
  Getcart,
  RemoveFromCart,
  UpdateCart,
} from "../Controllers/cart.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";
import { requireRole } from "../middlewares/rolemiddleware.js";

const route = Router();

route.post("/add_to_cart", privateRoute, requireRole("buyer"), AddToCart);

route.get("/fetch_cart_items", privateRoute, requireRole("buyer"), Getcart);

route.post("/update_item/:productId", privateRoute, requireRole("buyer"), UpdateCart);

route.post("/remove_item/:productId", privateRoute, requireRole("buyer"), RemoveFromCart);

route.post("/clear_cart", privateRoute, requireRole("buyer"), Clear_Cart);

export { route as CartRoute };
