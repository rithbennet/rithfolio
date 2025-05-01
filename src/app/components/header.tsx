"use client";

import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { FaMoon, FaSun } from "react-icons/fa";
import ThemeToggle from "../theme-toggle";

const Header = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full bg-[#0a0b14] px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <nav className="flex items-center space-x-8">
          <Link
            href="/"
            className="text-gray-300 transition-colors hover:text-white"
          >
            home
          </Link>
          <Link
            href="/projects"
            className="text-gray-300 transition-colors hover:text-white"
          >
            projects
          </Link>
          <Link
            href="/blog"
            className="text-gray-300 transition-colors hover:text-white"
          >
            blog
          </Link>
          <Link
            href="/contact"
            className="text-gray-300 transition-colors hover:text-white"
          >
            contact
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
