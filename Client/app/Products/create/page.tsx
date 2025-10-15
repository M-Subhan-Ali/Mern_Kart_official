"use client";

import axios from "axios";
import { useState } from "react";

const Create_Products = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files)); // store selected files
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare FormData
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) =>
        data.append(key, value)
      );

      images.forEach((file) => data.append("images", file)); // field name must match multer setup

      // 🔗 Send POST request to backend
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/product/create-product`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // include cookies/session if used
        }
      );

      alert("✅ Product created successfully!");
      console.log("Response:", res.data);

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        stock: "",
      });
      setImages([]);
    } catch (err) {
      console.error("❌ Error creating product:", err);
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Something went wrong!";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[100px] min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Create Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none cursor-pointer"
            >
              <option value="">Select category</option>
              <option value="men's clothing">men's clothing</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="Sports">Sports</option>
              <option value="groceries">Groceries</option>
              <option value="beauty">Beauty</option>
              <option value="women's clothing">Women's Clothing</option>
              <option value="jewelery">Jewelery</option>
              <option value="furniture">Furniture</option>
              <option value="fragrances">Fragrances</option>
              <option value="watch">Watches</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-50 text-gray-900 border border-gray-300 p-2 rounded-md cursor-pointer"
            />
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-3">
              {images.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-md border"
                />
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-gray-400" : "bg-teal-600 hover:bg-teal-700"
            } text-white font-medium py-2 px-4 rounded-md transition`}
          >
            {loading ? "Uploading..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create_Products;
