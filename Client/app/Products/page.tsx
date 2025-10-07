"use client";

import ParticlesBackground from "@/components/ParticleBackground";
import { useTheme } from "@/theme/ThemeProvider";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [backendDown, setBackendDown] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    let interval;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product`
        );
        const data = response.data;

        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
          setBackendDown(false);
        } else {
          setProducts([]);
          setBackendDown(true);
        }
      } catch (error) {
        console.log("Backend not responding:", error.message);
        setProducts([]);
        setBackendDown(true);
      }
    };

    // Run first fetch
    fetchProducts();

    // Keep polling every 5s to detect backend up/down
    interval = setInterval(fetchProducts, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-[100px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 bg-[linear-gradient(to_left,#241919ff_40%,#241919ff_60%)]">
      <ParticlesBackground />
      <div className="relative z-10 flex items-center justify-center w-full pb-8">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold 
               bg-white/10 backdrop-blur-sm 
               px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-center"
          style={{ color: theme.colors.text }}
        >
          All Products
        </h1>
      </div>

      <div className="relative z-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {backendDown
          ? // Skeleton Loader
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
          : products.map((product) => (
              <Link key={product._id} href={`/Products/${product._id}`}>
                <div className="bg-black border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                  <div className="w-full h-40 sm:h-48 md:h-56 relative">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h2 className="text-base sm:text-lg font-semibold text-[#ffffff] truncate">
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
                    <p
                      className="text-xs sm:text-sm font-bold"
                      style={{ color: theme.colors.text }}
                    >
                      Seller name: {product.seller.name}
                    </p>
                    <div
                      
                      className="inline-block mt-2 px-4 sm:px-5 py-2 
                       bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
                       text-white font-semibold rounded-lg shadow-md 
                       hover:from-[#2f6e72] hover:to-[#414449ff] 
                       focus:outline-none focus:ring-2 focus:ring-[#378C92] focus:ring-offset-2 
                       transition duration-300 ease-in-out text-center w-full sm:w-auto"
                    >
                      View Product
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default Products;
