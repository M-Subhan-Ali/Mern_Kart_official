"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product`
        );
        const data = response.data;
        if (data) {
          setProducts(data);
        } else {
          console.log("No products found");
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (!products.length) return <div className="p-6">Loading...</div>;

  return (
    <div className="pt-[100px] px-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-[#378C92] mb-10 text-center">
        All Products
      </h1>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <Link key={index} href={`/Products/${product._id}`}>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
              <div className="w-full h-48 relative">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-[#1F2540] truncate">
                  {product.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-[#378C92] font-semibold text-lg">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  Seller name:{product.seller.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
