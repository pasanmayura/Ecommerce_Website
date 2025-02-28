import React from "react";
import Link from "next/link";
import Image from "next/image";
import "@/styles/Header.css"; 
import logoSmartKade2 from "../images/logo-smart-kade-removebg-1.png";

export const Header = () => {
  return (
    <header className="header">
      <Image
        className="logo-smart-kade"
        alt="Smart Kade Logo"
        src={logoSmartKade2}
      />
      <nav className="nav">
        <Link href="/home" className="nav-link">Home</Link>
        <Link href="/contact" className="nav-link">Contact</Link>
        <Link href="/about" className="nav-link">About</Link>
        <Link href="/profile" className="nav-link">Profile</Link>
      </nav>
    </header>
  );
};
