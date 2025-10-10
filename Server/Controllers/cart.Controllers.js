import { Product } from "../model/Product.js";
import { Cart } from "../model/Cart.js";

export const AddToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.userID;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Invalid product or quantity" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "not enough stock is available!" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItems = cart.items.find((item) =>
      item.product.equals(productId)
    );

    if (existingItems) {
      if (existingItems.quantity + quantity > product.stock) {
        return res.status(400).json({ error: "Exceeded available stock" });
      }
      existingItems.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    const populate_product = await Cart.findById(cart._id).populate(
      "items.product",
      "title price stock images"
    );

    return res.status(200).json({
      message: "Item added to cart successfully",
      cart: populate_product,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ error: `internal server error ${error}` });
  }
};

export const Getcart = async (req, res) => {
  try {
    const userId = req.user.userID;
    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images stock"
    );

    if (!cart || cart.items.length == 0) {
      return res
        .status(200)
        .json({ message: "Cart is empty", cart: { items: [] } });
    }

    return res.status(200).json({ message: "Cart fetched Successfully", cart });
  } catch (error) {
    console.error("GetCart error:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

export const UpdateCart = async (req, res) => {
  try {
    const userId = req.user.userID;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: "not enough stock available" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found!" });
    }

    const item = await cart.items.find((i) => i.product.equals(product._id));

    if (!item) {
      return res.status(404).json({ error: "product not found" });
    }

    item.quantity = quantity;

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate(
      "items.product",
      "title stock images price"
    );

    return res
      .status(200)
      .json({ message: "Cart Successfully updated!", cart: updatedCart });
  } catch (error) {
    console.error("UpdateCartItem error:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

export const RemoveFromCart = async (req, res) => {
  try {
    const userid = req.user.userID;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userid });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    const new_Filtered_Items = cart.items.filter(
      (i) => !i.product.equals(productId)
    );

    if (new_Filtered_Items.length === cart.items.length) {
      return res.status(404).json({ error: "Product not found in the cart" });
    }

    cart.items = new_Filtered_Items;

    await cart.save();

    const Updated_cart = await Cart.findById(cart._id).populate(
      "items.product",
      "title price stock images"
    );

    return res
      .status(200)
      .json({ message: "Item removed Successfully", cart: Updated_cart });
  } catch (error) {
    console.error("RemoveFromCart error:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};

export const Clear_Cart = async (req, res) => {
  try {
    const userid = req.user.userID;
    const cart = await Cart.findOne({ user: userid });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({ message: "Cart cleared successfully", cart });
  } catch (error) {
    console.error("ClearCart error:", error);
    return res
      .status(500)
      .json({ error: `Internal server error: ${error.message}` });
  }
};
