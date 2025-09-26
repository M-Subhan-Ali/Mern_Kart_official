import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "../model/Product.js";
import { User } from "../model/user.js";
import connectDB from "../ConfigDatabase/mongoDb.js";

dotenv.config();

await connectDB();

const seedProducts = async () => {
  try {
    const sellers = await User.find({ role: "seller" });

    if (!sellers.length) {
      console.log("❗ No sellers found. Please seed users first.");
      return;
    }

    // ✅ Fetch from both APIs
    const [fakestoreRes, dummyjsonRes] = await Promise.all([
      fetch("https://fakestoreapi.com/products"),
      fetch("https://dummyjson.com/products"),
    ]);

    const fakestoreProducts = await fakestoreRes.json();
    const dummyjsonData = await dummyjsonRes.json();
    const dummyjsonProducts = dummyjsonData.products || [];

    // ✅ Merge products
    const allProducts = [
      ...fakestoreProducts.map((prod) => ({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        images: [prod.image],
        category: prod.category || "general",
      })),
      ...dummyjsonProducts.map((prod) => ({
        title: prod.title,
        description: prod.description,
        price: prod.price,
        images: prod.images?.length ? prod.images : [prod.thumbnail],
        category: prod.category || "general",
      })),
    ];

    if (!allProducts.length) {
      console.log("❌ No data fetched from APIs");
      return;
    }

    // Optional: Clear old products
    await Product.deleteMany();
    console.log("🧹 Old products removed");

    // Assign products randomly to sellers
    const productsToInsert = allProducts.map((prod) => {
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      return {
        ...prod,
        stock: Math.floor(Math.random() * 100) + 5,
        seller: randomSeller._id,
      };
    });

    await Product.insertMany(productsToInsert);
    console.log(`✅ Seeded ${productsToInsert.length} products from APIs`);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedProducts();
