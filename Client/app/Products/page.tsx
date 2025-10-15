"use client";

import ParticlesBackground from "@/components/ParticleBackground";
import { addToCart, fetchCart } from "@/redux/features/cartSlice";
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
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { role, user } = useAppSelector((state) => state.user);
  const { cart } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // 🧠 Fetch products based on role
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);

        let endpoint = `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product`;

        if (role === "seller") {
          endpoint = `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product/getsellerproducts`;
        }

        const res = await axios.get(endpoint, { withCredentials: true });
        const data = res.data;

        const items = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        setProducts(items);
      } catch (error: any) {
        console.error("❌ Failed to fetch products:", error.message);
        toast.error("Error fetching products. Please try again later.", {
          position: "bottom-center",
        });
      } finally {
        setLoadingProducts(false);
      }
    };

    if (role) {
      fetchProducts();
    }
  }, [role]);

  // 🔐 Fetch user role
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  // 🛒 Add to cart logic
  const handleAddToCart = async (productId: string) => {
    const alreadyInCart = cart?.items?.some(
      (item) => item.product._id === productId
    );

    if (alreadyInCart) {
      toast.info("🛒 This item is already in your cart!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      toast.success("✅ Added to cart!", {
        position: "bottom-center",
        autoClose: 2000,
      });
    } catch {
      toast.error("Failed to add to cart!", {
        position: "bottom-center",
      });
    }
  };

  // 🛍️ Buy, Edit, Delete handlers
  const handleBuyNow = () =>
    toast.info("Redirecting to checkout...", { position: "bottom-center" });

  const handleEdit = () =>
    toast.info("Redirecting to edit page...", { position: "bottom-center" });

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product/${productId}`,
        { withCredentials: true }
      );
      toast.success("🗑️ Product deleted successfully!", {
        position: "bottom-center",
      });
      setProducts((prev) => prev.filter((p: any) => p._id !== productId));
    } catch {
      toast.error("Failed to delete product.", { position: "bottom-center" });
    }
  };

  // 🧩 UI
  return (
    <div className="pt-[100px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-[linear-gradient(to_left,#241919ff_40%,#241919ff_60%)]">
      <ParticlesBackground />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-center w-full pb-8">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center"
          style={{ color: theme.colors.text }}
        >
          {role === "seller" ? "My Products" : "All Products"}
        </h1>
      </div>

      {/* Product grid */}
      <div className="relative z-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loadingProducts ? (
          Array(8)
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
        ) : products.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 text-lg italic">
            {role === "seller"
              ? "You haven’t added any products yet."
              : "No products available."}
          </div>
        ) : (
          products.map((product: any) => (
            <div
              key={product._id}
              className="bg-black border border-gray-800 rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              {/* Image */}
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

              {/* Details */}
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
                  Seller: {product.seller?.name || "Unknown"}
                </p>

                {/* Role actions */}
                {role === "buyer" && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <button
                      onClick={() => handleAddToCart(product._id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-[#7a86a4] to-[#414449] text-white rounded-lg shadow-md hover:from-[#2f6e72] hover:to-[#414449] transition duration-300"
                    >
                      🛒 Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow()}
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
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-blue-700 text-white text-xs rounded-lg transition duration-300"
                    >
                      ✏️ Edit Product
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-4 py-2 bg-red-900 hover:bg-red-700 text-xs text-white rounded-lg transition duration-300"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}

                {role !== "seller" && role !== "buyer" && (
                  <div className="mt-3 text-center">
                    <p className="text-gray-400 text-sm italic">
                      Please log in to view purchase options.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;
