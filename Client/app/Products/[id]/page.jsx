"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ParticlesBackground from "@/components/ParticleBackground";
import { useAppSelector } from "@/redux/hooks";
import Link from "next/link";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const params = useParams();
  const router = useRouter();
  const { role } = useAppSelector((state) => state.user)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product/${params?.id}`
        );
        setProduct(res.data);
        setSelectedImage(res.data?.images[0]);
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [params]);

  if (!product) return <div className="p-6">Loading...</div>;


  return (
    <div className="pt-[70px] px-4 sm:px-6 md:px-10 lg:px-32 w-full mx-auto ">
      <ParticlesBackground />

      {/* Back Button */}
      <button
        onClick={() => router.push("/Products")}
        className="relative z-10 mb-5 mt-2 px-4 py-2 bg-gray-100 border border-gray-300 
                   text-[#1F2540] rounded hover:bg-gray-200 transition cursor-pointer 
                   w-full sm:w-auto"
      >
        ← Back to Products
      </button>

      {/* Main Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left: Images */}
        <div>
          <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] 
                          bg-[linear-gradient(to_left,#241919ff_0%,#ffffff_10%,#ffffff_90%,#241919ff_100%)] 
                          relative border rounded-md overflow-hidden cursor-pointer">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Product"
                fill
                className="object-contain p-4"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-md cursor-pointer transition 
                  ${img === selectedImage ? "border-[#7a86a4ff]" : "border-gray-300"}`}
                onClick={() => setSelectedImage(img)}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col gap-4 bg-white px-4 sm:px-6 md:px-8 py-6 border rounded-md">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1F2540]">
            {product.title}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">{product.description}</p>
          <p className="text-xl sm:text-2xl text-[#378C92] font-semibold">
           Price :  ${product.price.toFixed(2)}
          </p>
          <p className="text-md text-white bg-black w-25 border rounded-md text-center">Stock: {product.stock}</p>
          <p className="text-sm text-gray-500">Seller: {product.seller?.name}</p>

          {role === "buyer" && <div className="grid">
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
            text-white font-semibold rounded-lg shadow-md 
            hover:from-[#41cd2bff] hover:to-[#414449ff] 
            focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
            transition duration-300 ease-in-out 
            w-full sm:w-auto"
            >
              Buy Now
            </button>
            <button
              className="mt-2 px-6 py-3 bg-gray-500 text-white rounded-lg 
            hover:bg-orange-500 transition cursor-pointer 
            w-full sm:w-auto"
            >
              Add to Cart
            </button>
          </div>}

          {role === "seller" && <div className="grid">
            <button
              className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
            text-white font-semibold rounded-lg shadow-md 
            hover:from-[#41cd2bff] hover:to-[#414449ff] 
            focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
            transition duration-300 ease-in-out 
            w-full sm:w-auto"
            >
              Edit
            </button>
            <button
              className="mt-2 px-6 py-3 bg-gray-500 text-white rounded-lg 
            hover:bg-orange-500 transition cursor-pointer 
            w-full sm:w-auto"
            >
              Delete
            </button>
          </div>}

          {role !== "seller" && role !== "buyer" && <div className="grid">
            <Link href={"/Login"}  className="mt-4 px-6 py-3 bg-gradient-to-r from-[#7a86a4ff] to-[#414449ff]
              text-white font-semibold rounded-lg shadow-md 
              hover:from-[#41cd2bff] hover:to-[#414449ff] 
            focus:outline-none focus:ring-2 focus:ring-[#41cd2bff] focus:ring-offset-2 
            transition duration-300 ease-in-out 
            w-full sm:w-auto text-center">
              Login for buying or manage products
            </Link>
            </div>}

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
