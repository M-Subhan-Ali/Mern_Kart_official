"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("buyer");

  const [businessName, setBusinessName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessDecription, setBusinessDecription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessPhoneNumber, setBusinessPhoneNumber] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      role,
      ...(role === "seller" && {
        businessName,
        businessAddress,
        businessDecription,
        phoneNumber,
        businessPhoneNumber,
      }),
    };

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/signUp`,
      userData,
      {
        withCredentials: true,
      }
    );

    if (response.data.user.role === "seller") {
      console.log("User signed up successfully:", response.data);
      router.refresh();
      router.push("/Seller");
    } else if (response.data.user.role === "buyer") {
      console.log("User signed up successfully:", response.data);
      router.refresh();
      router.push("/Buyer");
    } else {
      console.log("Sign up failed. Please try again.");
    }

    console.log("Signup attempt with:", userData);
  };

  return (
    <div className="bg-gradient-to-br from-gray-600 to-gray-300 flex items-center justify-center pt-[130px] pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gradient-to-tl from-gray-300 to-blue-300 rounded-2xl shadow-xl p-8 space-y-8 transform transition-all duration-500">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Join Mern Kart
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Create an account for a personalized shopping experience
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
              placeholder="Name"
            />
          </div>
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
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
              placeholder="Email"
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

          {/* Conditionally show seller fields */}
          {role === "seller" && (
            <>
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
                  placeholder="Business Name"
                />
              </div>
              <div>
                <label
                  htmlFor="businessAddress"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Address
                </label>
                <input
                  id="businessAddress"
                  name="businessAddress"
                  type="text"
                  required
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
                  placeholder="Business Address"
                />
              </div>
              <div>
                <label
                  htmlFor="businessDecription"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Description
                </label>
                <input
                  id="businessDecription"
                  name="businessDecription"
                  type="text"
                  required
                  value={businessDecription}
                  onChange={(e) => setBusinessDecription(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
                  placeholder="Describe your business"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
                  placeholder="Personal Contact Number"
                />
              </div>
              <div>
                <label
                  htmlFor="businessPhoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Phone Number
                </label>
                <input
                  id="businessPhoneNumber"
                  name="businessPhoneNumber"
                  type="text"
                  required
                  value={businessPhoneNumber}
                  onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                  className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
                  placeholder="Business Contact Number"
                />
              </div>
            </>
          )}

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
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 rounded-lg border border-gray-600 shadow-sm transition duration-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-gray-600 focus:border-gray-800"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-gray-400 focus:ring-gray-400 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
              I agree to the{" "}
              <a
                href="#terms"
                className="text-gray-500 hover:text-gray-600 transition duration-300 underline"
              >
                Terms & Conditions
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold rounded-lg shadow-md hover:from-gray-500 hover:to-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/Login"
            className="text-black font-medium transition duration-300"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
