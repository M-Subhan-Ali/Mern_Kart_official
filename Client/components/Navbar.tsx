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

  // console.log(Authenticated, "authenticated");
  console.log(data, "Dataaa");

  return (
    <div className="bg-gray-100">
      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white fixed w-full z-50">
        <div className="container h-[70px] mx-auto px-4 py-4 flex justify-between items-center">
          <div className="relative flex items-center ">
            <Link href="/">
              <Image
                src="/logo1.png"
                alt="Logo Store"
                width={150}
                height={150}
              />
            </Link>
          </div>
          {Authenticated ? (
            <div className="flex items-center space-x-4">
              <h1 className="font-bold text-xl">Welcome {user}!</h1>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-black bg-white hover:bg-amber-200 cursor-pointer rounded-lg transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 text-black bg-white hover:bg-amber-200 cursor-pointer rounded-lg transition duration-300"
              >
                Login
              </button>
              <button
                onClick={handleSignUp}
                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 cursor-pointer rounded-lg transition duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
