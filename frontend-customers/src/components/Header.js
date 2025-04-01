'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/Header.css";
import logoSmartKade2 from "../images/logo-smart-kade-removebg-1.png";
import { TextField, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

export const Header = ({ isHomePage = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchBarRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Close the search bar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setSearchOpen(false); // Close the search bar
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <header className="header">
      {/* Logo */}
      <div className={`header-logo ${searchOpen ? "hidden" : ""}`}>
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
        {isHomePage ? (
          <Link href="/SignIn" className="nav-link">Sign In</Link>
        ) : (
          <Link href="/MyAccount" className="nav-link">My Account</Link>
        )}
      </nav>

      {/* Search Bar and Icons */}
      <div className="header-actions">
        {searchOpen ? (
          <TextField
            ref={searchBarRef}
            className="search-bar"
            placeholder="Search products..."
            variant="outlined"
            size="small"
            autoFocus
          />
        ) : (
          <IconButton aria-label="search" className="icon-button" onClick={toggleSearch}>
            <SearchIcon />
          </IconButton>
        )}
        <IconButton aria-label="favorites" className="icon-button">
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="cart" className="icon-button">
          <ShoppingCartIcon />
        </IconButton>
      </div>

      {/* Menu Icon for Smaller Screens */}
      <div className="menu-icon" onClick={toggleMenu}>
        <MenuIcon />
      </div>
    </header>
  );
};
