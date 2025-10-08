"use client";

import ParticlesBackground from "@/components/ParticleBackground";
import { fetchUserInfo } from "@/redux/features/userSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useTheme } from "@/theme/ThemeProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [backendDown, setBackendDown] = useState(true);
  const {role , user , loading } = useAppSelector((state)=>state.user);
  const dispatch = useAppDispatch()
  const theme = useTheme();

  // fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product`
        );
        const data = res.data;
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setBackendDown(false);
        } else {
          setProducts([]);
          setBackendDown(true);
        }
      } catch (error: any) {
        console.error("Backend not responding:", error.message);
        setProducts([]);
        setBackendDown(true);
      }
    };

    fetchProducts();
  }, []);

  // fetch user role 
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch]);

  
  const handleAddToCart = (productId: string) => {
    toast.success("Added to cart!", { position: "bottom-center" });
  };

  const handleBuyNow = (productId: string) => {
    toast.info("Redirecting to checkout...", { position: "bottom-center" });
  };

  const handleEdit = (productId: string) => {
    toast.info("Redirecting to edit page...", { position: "bottom-center" });
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product/${productId}`,
        { withCredentials: true }
      );
      toast.success("Product deleted successfully!", {
        position: "bottom-center",
      });
      setProducts((prev) => prev.filter((p: any) => p._id !== productId));
    } catch {
      toast.error("Failed to delete product.", { position: "bottom-center" });
    }
  };

  return (
    <div className="pt-[100px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-[linear-gradient(to_left,#241919ff_40%,#241919ff_60%)]">
      <ParticlesBackground />

      {/* Heading */}
      <div className="relative z-10 flex items-center justify-center w-full pb-8">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center"
          style={{ color: theme.colors.text }}
        >
          All Products
        </h1>
      </div>

      {/* Products Grid */}
      <div className="relative z-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {backendDown
          ? Array(8)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4"
                >
                  <Skeleton height={192} />
                  <div className="mt-4 space-y-2">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={15} count={2} />
                    <Skeleton height={20} width="40%" />
                    <Skeleton height={12} width="60%" />
                  </div>
                </div>
              ))
          : products.map((product: any) => (
              <div
                key={product._id}
                className="bg-black border border-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
              >
                {/* Product Image */}
                <Link href={`/Products/${product._id}`}>
                  <div className="w-full h-40 sm:h-48 md:h-56 relative">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4 flex flex-col gap-2">
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                  <p
                    className="font-semibold text-base sm:text-lg"
                    style={{ color: theme.colors.primary }}
                  >
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-gray-400">
                    Seller: {product.seller.name}
                  </p>

                  {/* Role-Based Actions */}
                  {role === "buyer" && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <button
                        onClick={() => handleAddToCart(product._id)}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7a86a4] to-[#414449] text-white rounded-lg shadow-md hover:from-[#2f6e72] hover:to-[#414449] transition duration-300"
                      >
                        🛒 Add to Cart
                      </button>
                      <button
                        onClick={() => handleBuyNow(product._id)}
                        className="flex-1 px-4 py-2 bg-[#378C92] hover:bg-[#2f6e72] text-white rounded-lg transition duration-300"
                      >
                        💳 Buy Now
                      </button>
                    </div>
                  )}

                  {role === "seller" && (
                    <div className="flex flex-col sm:flex-row gap-2 mt-3">
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
                      >
                        ✏️ Edit Product
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition duration-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}

                  {!role && (
                    <div className="mt-3 text-center">
                      <p className="text-gray-400 text-sm italic">
                        Please log in to view purchase options.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default Products;
