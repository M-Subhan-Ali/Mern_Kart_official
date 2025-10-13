import { Router } from "express";
import {
  createProduct,
  DeleteProduct,
  fetch_ProductBy_ID,
  getAllProducts,
  Update_product,
} from "../Controllers/products.Controllers.js";
import { privateRoute } from "../middlewares/authmiddleware.js";
import { requireRole } from "../middlewares/rolemiddleware.js";
import { upload } from "../middlewares/upload.js";
const router = Router();

router.get("/", getAllProducts); //public routes bro

router.get("/:id", fetch_ProductBy_ID);

router.post(
  "/create-product",
  privateRoute,
  requireRole("seller"),
  upload.array("images",5),
  createProduct
);

router.post(
  "/update-product/:id",
  privateRoute,
  requireRole("seller"),
  Update_product
);

router.post("/delete/:id", privateRoute, requireRole("seller"), DeleteProduct);

export { router as ProductRoute };
