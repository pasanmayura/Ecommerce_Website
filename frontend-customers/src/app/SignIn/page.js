"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, TextField } from "@mui/material";
import Footer from "@/components/Footer";
import loginImg1 from "@/images/login-img-1.png";
import { loginUser } from "@/services/authService";
import { HeaderAuth } from "@/components/HeaderAuth";
import "@/styles/SignIn.css";

const SignIn = () => {
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
      const result = await loginUser(Email, Password); 
      
      if (result.message === 'Login successful') {
        sessionStorage.setItem('jwtToken', result.token);
        alert(result.message);
        router.push('/HomeLogin'); 
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('There was an error with the login. Please try again.');
    }
  };

  return (
    <div className="signIn">
      <HeaderAuth isSignIn={true} />

      <main className="main-content">
        <div className="image-section">
          <Image className="login-img" alt="Login Illustration" src={loginImg1} height={600} width={500} />
        </div>
        <div className="login-form-section">
          <h1 className="form-title">Login</h1>
          <p className="form-subtitle">Enter your details below</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                id="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                id="Password"
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
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

export default SignIn;
