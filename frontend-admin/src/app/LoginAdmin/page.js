"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import { Footer } from "@/components/Footer";
import loginImg1 from "@/images/login-img-1.png";
import logoSmartKadeRemovebg1 from "@/images/logo-smart-kade-removebg-1.png"; 
import { loginAdmin } from "@/Services/authService"; 
import "@/styles/Register.css"; 
import "@/styles/Common.css";

const LoginAdmin = () => {
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!Email || !Password) {
      setErrorMessage('Both fields are required!');
      return;
    }
  
    try {
      console.log('Sending login request...');
      const result = await loginAdmin(Email, Password); 
      console.log('Received response:', result);
      
      if (result.message === 'Login successful') {
        sessionStorage.setItem('jwtToken', result.token);
        alert(result.message);
        router.push('/Dashboard'); // Navigate in Next.js
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('There was an error with the login. Please try again.');
    }
  };

  return (
    <div className="register">
      <header className="headerLoginAdmin">
        <Image
          className="headerLoginAdmin-logo-smart-kade"
          alt="Smart Kade Logo"
          src={logoSmartKadeRemovebg1}
          width={150}
          height={50}
          priority
        />
        <nav className="nav">
          <Link href="/home" className="nav-link">Home</Link>
          <Link href="/contact" className="nav-link">Contact</Link>
          <Link href="/about" className="nav-link">About</Link>
          <Link href="/register" className="nav-link">Sign Up</Link>
        </nav>
      </header>

      <main className="main-content">
        <div className="image-section">
          <Image className="login-img" alt="Login Illustration" src={loginImg1} height={600} width={500} />
        </div>
        <div className="login-form-section">
          <h1 className="form-title">Login</h1>
          <p className="form-subtitle">Enter your details below</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" placeholder="Email" id="Email" className="form-input" value={Email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <input type="password" placeholder="Password" id="Password" className="form-input" value={Password} onChange={(e) => setPassword(e.target.value)}/>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="button-container"> 
              <Button 
                disableElevation 
                variant="contained" 
                className="login-form-button"
                type="submit"
              >
                Login
              </Button>
            </div> 
          </form>
        </div>
      </main>
      <Footer /> 
    </div>
  );
};

export default LoginAdmin;
