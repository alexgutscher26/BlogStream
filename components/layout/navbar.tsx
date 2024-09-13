"use client";

import { Ghost } from "lucide-react";
import React from "react";
import Link from "next/link";
import { ToggleTheme } from "./toogle-theme";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { useState } from "react";

// NavLink component
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const { theme } = useTheme();

  return (
    <Link
      href={href}
      className={`transition-transform duration-300 ease-in-out transform hover:scale-105 ${
        theme === "light" ? "text-black" : "text-white"
      }`}
    >
      {children}
    </Link>
  );
};

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header
      className={`${
        theme === "light" ? "shadow-lg" : "shadow-inner"
      } bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-center items-center p-2 bg-card transition-shadow duration-300 ease-in-out`}
    >
      {/* Desktop */}
      <nav className="container flex items-center justify-between px-8 py-4 mx-auto">
        <div className="flex lg:flex-1">
          <NavLink href="/">
            <span className="flex items-center gap-2 shrink-0">
              <Ghost className="transition-transform transform hover:rotate-12 duration-300 ease-in-out" />
              <span className="font-extrabold text-lg">BlogStream</span>
            </span>
          </NavLink>
        </div>
        <div className="flex lg:justify-center gap-2 lg:gap-12 lg:items-center">
          <NavLink href="/#pricing">Pricing</NavLink>
          <SignedIn>
            <NavLink href="/posts">Your Posts</NavLink>
            {/* Add Settings Page Link */}
            <NavLink href="/settings">Settings</NavLink>
          </SignedIn>
        </div>

        <div className="flex lg:justify-end lg:flex-1 items-center">
          <SignedIn>
            <div className="flex gap-2 items-center">
              <NavLink href="/dashboard">Upload a Video</NavLink>
              <UserButton />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <NavLink href="/sign-in">Sign In</NavLink>
            </SignInButton>
          </SignedOut>
          <div className="ml-4 transition-opacity duration-300 ease-in-out">
            <ToggleTheme />
          </div>
        </div>
      </nav>
    </header>
  );
};
