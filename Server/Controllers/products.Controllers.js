import { Product } from "../model/Product.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const product = await Product.find().populate("seller", "name email").sort({
      createdAt:-1
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    console.log("🔥 req.user =>", req.user);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: req.user not found.",
      });
    }

    const seller_ID = req.user.userID;
    const products = await Product.find({ seller: seller_ID }).sort({
      createdAt: -1,
    });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this seller.",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller products retrieved successfully.",
      products,
    });
  } catch (error) {
    console.error("❌ Error fetching seller products:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetch_ProductBy_ID = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "seller",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, images, category, stock } = req.body;

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ error: "Only seller can create products!" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ error: "Please upload at least one image!" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const image = await uploadToCloudinary(file.buffer, "products");
      uploadedImages.push(image); // get the Cloudinary URL
    }

    const product = new Product({
      title,
      description,
      price,
      images: uploadedImages,
      stock,
      category,
      seller: req.user.userID,
    });

    await product.save();
    return res
      .status(201)
      .json({ message: "Successfully create Product", product });
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};

export const Update_product = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    if (product.seller.toString() !== req.user.userID) {
      return res
        .status(403)
        .json({ error: "not authorized to update the product!" });
    }

    const {
      title,
      description,
      price,
      category,
      stock,
      existingImagesToKeep, 
    } = req.body;
    
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;


    let finalImages = [];

    try {
      const keptImages = existingImagesToKeep ? JSON.parse(existingImagesToKeep) : [];
      finalImages = [...keptImages];
      
    } catch (e) {
      console.error("Error parsing existingImagesToKeep:", e);
    }


    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const image = await uploadToCloudinary(file.buffer, "products");
            finalImages.push(image);
        }
    }
    
    product.images = finalImages;

    await product.save();

    res.status(200).json({ 
        message: "Product updated successfully", 
        product: product.toObject() 
    });
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ error: "Product not found!" });
    }

    if (product.seller.toString() !== req.user.userID) {
      return res
        .status(403)
        .json({ error: "not authorized to delete the product!" });
    }

    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ error: `internal server error ${error}` });
  }
};
