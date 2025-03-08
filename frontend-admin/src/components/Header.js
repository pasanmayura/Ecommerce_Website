'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { getProfile } from '@/Services/profileService';
import "@/styles/Header.css"; 
import logoSmartKade2 from "../images/logo-smart-kade-removebg-1.png";

export const Header = () => {
  const [user, setUser] = useState({
    FirstName: '',
    LastName: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('jwtToken');
        if (!token) {
          console.error("No token found in sessionStorage");
          return;
        }
        const userProfile = await getProfile(token);
        setUser(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <header className="header">
      <Image
        className="logo-smart-kade"
        alt="Smart Kade Logo"
        src={logoSmartKade2}
      />
      <nav className="header-nav">
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: '#0A2F6E', width: 40, height: 40 }}>
            {user.FirstName.charAt(0)}
          </Avatar>
          <span>{user.FirstName} {user.LastName}</span>
        </Stack>
      </nav>
    </header>
  );
};
