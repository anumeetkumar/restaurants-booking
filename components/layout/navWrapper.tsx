"use client";

import React from "react";
import { Navbar } from "./navbar";
import { usePathname } from "next/navigation";

const NavWrapper = () => {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/admin")) return null;

  return <Navbar />;
};

export default NavWrapper;
