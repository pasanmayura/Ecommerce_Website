'use client';

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/Header.css";
import logoSmartKade2 from "../images/logo-smart-kade-removebg-1.png";
import MenuIcon from "@mui/icons-material/Menu";

export const HeaderAuth = ({ isSignIn = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="header-logo">
        <Image
          className="logo-smart-kade"
          alt="Smart Kade Logo"
          src={logoSmartKade2}
        />
      </div>

      {/* Navigation Links */}
      <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
        <Link href="/about" className="nav-link">About Us</Link>
        {isSignIn ? (
          <Link href="/SignUp" className="nav-link">Sign Up</Link>
        ) : (
          <Link href="/SignIn" className="nav-link">Sign In</Link>
        )}
      </nav>

      {/* Menu Icon for Smaller Screens */}
      <div className="menu-icon-auth" onClick={toggleMenu}>
        <MenuIcon />
      </div>
    </header>
  );
};
