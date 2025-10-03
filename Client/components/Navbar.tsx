"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useCookies } from "react-cookie";

const Navbar: React.FC = () => {
  const [Authenticated, setAuthenticated] = useState(null);
  const [data, setData] = useState("");
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 toggle menu

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/user/getUserInfo`,
          {
            withCredentials: true,
          }
        );
        const data = await response.data;
        if (response) {
          setUser(data.user.name);
        } else {
          console.error("Failed to fetch user", data.error);
        }
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    getUserInfo();
  }, [pathname]);

  const checkLogin = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/user/userInfo`,
        { withCredentials: true }
      );
      if (response.data?.user) {
        setAuthenticated(true);
        setData(response.data?.user);
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      setAuthenticated(false);
    }
  };

  useEffect(() => {
    checkLogin();
  }, [pathname]);

  const handleLogout = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    removeCookie("token");
    router.push("/");
    if (response.data) {
      setAuthenticated(false);
    } else {
      setAuthenticated(true);
    }
  };

  const handleLogin = () => {
    router.push("/Login");
  };

  const handleSignUp = () => {
    router.push("/SignUp");
  };

  const handleCart = () => {
    router.push("/Cart");
  };

  return (
    <div className="bg-gray-100">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white fixed w-full z-50">
        <div className="container h-[70px] mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="Logo Store"
                width={130}
                height={130}
                className="w-28 sm:w-32 md:w-36 lg:w-40 h-auto"
              />
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden sm:flex items-center space-x-4">
            {Authenticated ? (
              <>
                <h1 className="font-bold text-base sm:text-lg md:text-xl truncate max-w-[140px] sm:max-w-none">
                  Welcome {user}!
                </h1>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-black bg-white hover:bg-amber-200 cursor-pointer rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-black bg-white hover:bg-amber-200 cursor-pointer rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Menu */}
        {menuOpen && (
          <div className="sm:hidden fixed top-0 right-0 h-full w-2/3 bg-gray-900 shadow-lg z-50 p-6 flex flex-col space-y-4 animate-slide-in">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-right text-xl"
            >
              ✖
            </button>

            {Authenticated ? (
              <>
                <p className="font-bold text-white">Hi {user}</p>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-black bg-white hover:bg-amber-200 rounded-lg transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 text-black bg-white hover:bg-amber-200 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
