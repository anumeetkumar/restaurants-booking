"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Organizations from "./organizations/page";
import Admin from "./page";


const Layout = () => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className={`block rounded-lg px-3 py-2 transition ${
              pathname === "/admin" ? "bg-gray-700" : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/organizations"
            className={`block rounded-lg px-3 py-2 transition ${
              pathname === "/admin/organizations"
                ? "bg-gray-700 font-medium"
                : "hover:bg-gray-800"
            }`}
          >
            Organizations
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-100">
        {pathname === "/admin/organizations" ? <Organizations /> : <Admin />}
      </main>
    </div>
  );
};

export default Layout;
