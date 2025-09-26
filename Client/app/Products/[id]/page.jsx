"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const params = useParams();
  const router = useRouter();

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
    <div className="pt-[100px] px-6 max-w-6xl mx-auto">
      <button
        onClick={() => router.push("/Products")}
        className="mb-6 px-4 py-2 bg-gray-100 border border-gray-300 text-[#1F2540] rounded hover:bg-gray-200 transition cursor-pointer"
      >
        ← Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 ">
        {/* Left: Images */}
        <div>
          <div className="w-full h-[400px] relative border rounded-md overflow-hidden cursor-pointer">
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Selected Product"
                fill
                className="object-contain p-4"
              />
            )}
          </div>

          <div className="flex gap-3 mt-4 overflow-x-auto">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={`relative w-20 h-20 border-2 rounded-md cursor-pointer transition ${
                  img === selectedImage ? "border-[#378C92]" : "border-gray-300"
                }`}
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
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-[#1F2540]">{product.title}</h1>
          <p className="text-lg text-gray-600">{product.description}</p>
          <p className="text-2xl text-[#378C92] font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">
            Seller: {product.seller?.name}
          </p>

          <button className="mt-4 px-6 py-3 bg-[#378C92] text-white rounded hover:bg-[#2b6d71] transition cursor-pointer">
            Buy Now
          </button>
          <button className="mt-4 px-6 py-3 bg-[gray] text-white rounded hover:bg-[orange] transition cursor-pointer">
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
