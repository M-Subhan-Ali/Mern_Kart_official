"use client";
import React from "react";
import { CookiesProvider } from "react-cookie";
import Navbar from "./Navbar";

const NavbarWrapper = () => {
  return (
    <CookiesProvider>
      <Navbar />
    </CookiesProvider>
  );
};

export default NavbarWrapper;
