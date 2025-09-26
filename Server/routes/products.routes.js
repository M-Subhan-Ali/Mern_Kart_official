import { Router } from "express";
import {
  createProduct,
  DeleteProduct,
  fetch_ProductBy_ID,
  getAllProducts,
  Update_product,
} from "../Controllers/products.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";
const router = Router();

router.get("/", getAllProducts); //public routes bro

router.get("/:id", fetch_ProductBy_ID);

router.post("/create-product", privateRoute, createProduct);

router.post("/update-product/:id", privateRoute, Update_product);

router.post("/delete/:id", privateRoute, DeleteProduct);

export { router as ProductRoute };
