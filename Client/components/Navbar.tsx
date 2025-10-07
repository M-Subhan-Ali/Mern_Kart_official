"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";

const Navbar: React.FC = () => {
  const [Authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasLoggedOut, setHasLoggedOut] = useState(false);
  const [cookies, , removeCookie] = useCookies(["token"]);

  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement | null>(null); // 👈 ref for outside click

  // ✅ Close menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleOutsideClick);
    else document.removeEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // ✅ Trigger logout success toast AFTER redirect
  useEffect(() => {
    if (typeof window !== "undefined") {
      const logoutFlag = localStorage.getItem("logoutSuccess");
      if (logoutFlag === "true") {
        setTimeout(() => {
          toast.success("You’ve been logged out successfully!", {
            position: "top-center",
            autoClose: 2500,
          });
          localStorage.removeItem("logoutSuccess");
        }, 400);
      }
    }
  }, [pathname]);

  // ✅ Show login success once
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loginFlag = localStorage.getItem("loginSuccess");
      if (loginFlag === "true") {
        setTimeout(() => {
          toast.success("Login successful! Welcome back 🎉", {
            position: "top-center",
            autoClose: 2500,
          });
          localStorage.removeItem("loginSuccess");
        }, 400);
      }
    }
  }, [pathname]);

  // === Fetch user info ===
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_ROUTE}/user/getUserInfo`,
          { withCredentials: true }
        );
        const data = res.data;
        if (data?.user) {
          setUser(data.user.name);
          setRole(data.user.role);
          setAuthenticated(true);
        } else setAuthenticated(false);
      } catch {
        setAuthenticated(false);
      }
    };
    getUserInfo();
  }, [pathname]);

  // === Logout ===
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_ROUTE}/authentication/logout`,
        {},
        { withCredentials: true }
      );

      removeCookie("token");
      setAuthenticated(false);
      setUser(null);
      setHasLoggedOut(true);

      if (typeof window !== "undefined") {
        localStorage.setItem("logoutSuccess", "true");
      }

      router.push("/");
    } catch {
      toast.error("Something went wrong while logging out.", {
        position: "top-center",
      });
    }
  };

  const handleLogin = () => {
    toast.info("Redirecting to Login page...", { position: "bottom-center" });
    router.push("/Login");
  };

  const handleSignUp = () => {
    toast.info("Redirecting to Sign Up page...", { position: "bottom-center" });
    router.push("/SignUp");
  };

  const handleCart = () => {
    toast.info("Opening your cart...", { position: "bottom-center" });
    router.push("/Cart");
  };

  const handleDashboard = (role: string) => {
    if (!role) {
      toast.warning("User role not found. Please re-login.", {
        position: "bottom-center",
      });
      return;
    }
    const route = `/${role.charAt(0).toUpperCase() + role.slice(1)}`;
    toast.info(`Redirecting to ${route} Dashboard...`, {
      position: "bottom-center",
    });
    router.push(route);
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
                alt="Logo"
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
                <button
                  onClick={() => handleDashboard(role)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Welcome {user}!
                </button>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleCart}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  🛒 Cart
                </button>
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition duration-300 text-sm sm:text-base"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="sm:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="text-white focus:outline-none"
            >
              {menuOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>

        {/* ✅ Mobile Slide-Out Menu */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="sm:hidden fixed top-0 right-0 h-full w-2/3 bg-gray-900 shadow-lg z-[999] p-6 flex flex-col space-y-4 animate-slide-in transition-all duration-300"
          >
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
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition"
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
                  className="px-4 py-2 bg-white text-black hover:bg-amber-200 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUp}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
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
