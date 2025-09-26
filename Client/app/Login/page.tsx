"use client";
import Link from "next/link";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // default
  const [data, setData] = useState(null);
  const [errorMessage, setErrormessage] = useState("");

  const route = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const loginData = { email, password, role };
    // console.log('Login attempt with:', loginData)
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/Login`,
        loginData,
        {
          withCredentials: true,
        }
      );
      if (response.data.user.role === "seller") {
        route.push("/Seller");
      } else if (response.data.user.role === "buyer") {
        route.push("/Buyer");
      }
      setData(response.data);
    } catch (error) {
      setErrormessage(error?.response?.data?.error || "something went wrong ");
    }
  };

  console.log(data);

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
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400"
              placeholder="Email"
            />
          </div>

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm focus:ring-gray-600 focus:border-gray-800 transition duration-300 text-gray-900 placeholder-gray-400"
              placeholder="••••••••"
            />
          </div>

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

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            Sign In
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
