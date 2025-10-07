"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("buyer");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ✅ SAFEST: get values from form elements (mobile-autofill safe)
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    if (!email || !password) {
      toast.warning("Please enter both email and password.", {
        position: "top-center",
        autoClose: 2500,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/Login`,
        { email, password, role },
        { withCredentials: true }
      );

      if (response.data?.user) {
        const userRole = response.data.user.role;

        if (typeof window !== "undefined") {
          localStorage.setItem("loginSuccess", "true");
        }

        toast.success("Login successful! Redirecting...", {
          position: "top-center",
          autoClose: 1800,
        });

        setTimeout(() => {
          router.push(userRole === "seller" ? "/Seller" : "/Buyer");
        }, 1500);
      } else {
        toast.error("Unexpected response. Please try again later.", {
          position: "top-center",
        });
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          "Invalid email or password. Please try again.",
        { position: "top-center", autoClose: 3000 }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 to-gray-300 flex items-center justify-center pt-[70px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gradient-to-tl from-white to-blue-300 rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-500">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back to Mern Kart
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your personalized shopping experience
          </p>
        </div>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          autoComplete="on" // ✅ ensures mobile autofill works properly
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Select Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-400 text-gray-900 transition duration-300"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-600"
              >
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#forgot-password"
                className="text-sm underline text-gray-500 hover:text-gray-600 transition duration-300"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none ${
              loading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600"
            }`}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/SignUp"
            className="text-black font-medium transition duration-300"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
