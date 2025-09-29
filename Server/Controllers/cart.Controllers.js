import { Product } from "../model/Product";
import { Cart } from "../model/Cart";

export const Add_to_cart =  async (req,res) => {
    const {productId,quantity} = req.body;

    const userId = req.user.userID;

    const product = await Product.findById(productId)


    if(!product){
        return res.status(404).json({
            error:"no product found"
        })
    }

    if(product.stock < quantity){
        return res.status(400).json({
            error:{
                "not enough stock available!"
            }
        }) 
    }

    let cart = await Cart.findOne({user:UserId})

    if(!cart){
        cart=new Cart({user:userId,items:[]})
    }



}



// import { Cart } from "../model/Cart.js";
// import { Product } from "../model/Product.js";

// /**
//  * @desc Add product to cart
//  * @route POST /api/cart/add
//  * @access Private (buyer only)
//  */
// export const addToCart = async (req, res) => {
//   try {
//     const { productId, quantity } = req.body;
//     const userId = req.user.userID; // from JWT middleware

//     // Check product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     // Check stock
//     if (product.stock < quantity) {
//       return res
//         .status(400)
//         .json({ error: "Not enough stock available!" });
//     }

//     // Find cart or create a new one
//     let cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       cart = new Cart({ user: userId, items: [] });
//     }

//     // Check if product already exists in cart
//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex > -1) {
//       // Update quantity
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       // Add new product
//       cart.items.push({ product: productId, quantity });
//     }

//     await cart.save();
//     res.status(200).json({ message: "Item added to cart", cart });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };

// /**
//  * @desc Get user cart
//  * @route GET /api/cart
//  * @access Private
//  */
// export const getCart = async (req, res) => {
//   try {
//     const userId = req.user.userID;

//     const cart = await Cart.findOne({ user: userId }).populate(
//       "items.product",
//       "title price images stock"
//     );

//     if (!cart) {
//       return res.status(200).json({ message: "Cart is empty", items: [] });
//     }

//     res.status(200).json(cart);
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };

// /**
//  * @desc Remove product from cart
//  * @route DELETE /api/cart/:productId
//  * @access Private
//  */
// export const removeFromCart = async (req, res) => {
//   try {
//     const userId = req.user.userID;
//     const { productId } = req.params;

//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found" });
//     }

//     cart.items = cart.items.filter(
//       (item) => item.product.toString() !== productId
//     );

//     await cart.save();
//     res.status(200).json({ message: "Item removed from cart", cart });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };

// /**
//  * @desc Update quantity of a product in cart
//  * @route PUT /api/cart/:productId
//  * @access Private
//  */
// export const updateCartItem = async (req, res) => {
//   try {
//     const userId = req.user.userID;
//     const { productId } = req.params;
//     const { quantity } = req.body;

//     if (quantity < 1) {
//       return res.status(400).json({ error: "Quantity must be at least 1" });
//     }

//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//       return res.status(404).json({ error: "Cart not found" });
//     }

//     const itemIndex = cart.items.findIndex(
//       (item) => item.product.toString() === productId
//     );

//     if (itemIndex === -1) {
//       return res.status(404).json({ error: "Product not in cart" });
//     }

//     cart.items[itemIndex].quantity = quantity;
//     await cart.save();

//     res.status(200).json({ message: "Cart updated", cart });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };

// /**
//  * @desc Clear cart
//  * @route DELETE /api/cart
//  * @access Private
//  */
// export const clearCart = async (req, res) => {
//   try {
//     const userId = req.user.userID;
//     await Cart.findOneAndDelete({ user: userId });
//     res.status(200).json({ message: "Cart cleared" });
//   } catch (error) {
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   }
// };
