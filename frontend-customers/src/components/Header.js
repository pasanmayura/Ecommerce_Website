'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logoSmartKade2 from "../images/logo-smart-kade-removebg-1.png";
import { TextField, IconButton } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "@/styles/Header.css";

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchBarRef = useRef(null);
  const router = useRouter();

  // Check if the user is logged in
  useEffect(() => {
    const token = sessionStorage.getItem("jwtToken"); 
    setIsLoggedIn(!!token); // Set login status based on token presence
  }, []);

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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      router.push(`/Products?search=${encodeURIComponent(searchQuery)}`); // Navigate to the Products page with the search query
    }
  };

  const ViewCart = () => {
    router.push("/ViewCart");
  }

  const ViewWishlistPage = () => {
    router.push("/WishlistPage");
  }

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
        <Link href="/Contact" className="nav-link">Contact Us</Link>
        <Link href="/AboutUs" className="nav-link">About Us</Link>
        {isLoggedIn ? (
          <Link href="/MyAccount" className="nav-link">My Account</Link>
        ) : (
          <Link href="/SignIn" className="nav-link">Sign In</Link>
        )}
      </nav>

      {/* Search Bar and Icons */}
      <div className="header-actions">
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit}>
            <TextField
              ref={searchBarRef}
              className="search-bar"
              placeholder="Search products..."
              variant="outlined"
              size="small"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        ) : (
          <IconButton aria-label="search" className="icon-button" onClick={toggleSearch}>
            <SearchIcon />
          </IconButton>
        )}
        <IconButton aria-label="favorites" className="icon-button" onClick={ViewWishlistPage}>
          <FavoriteBorderIcon />
        </IconButton>
        <IconButton aria-label="cart" className="icon-button" onClick={ViewCart}>
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
