"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import OTPInput from "react-otp-input";
import Footer from "@/components/Footer";
import loginImg1 from "@/images/login-img-1.png";
import { registerUser, verifyEmailCode } from "@/services/authService"; // Add verifyEmailCode function
import { HeaderAuth } from "@/components/HeaderAuth";
import "@/styles/SignIn.css";

const SignUp = () => {
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!FirstName || !LastName || !Email || !Password) {
      setErrorMessage('All fields are required!');
      return;
    }
  
    try {
      const result = await registerUser(FirstName, LastName, Email, Password);
  
      if (result.success) {
        alert(result.message);
        setIsModalOpen(true); // Open the modal for email verification
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('There was an error with the sign-up. Please try again.');
    }
  };
  
  const handleVerifyCode = async () => {
    try {
      const result = await verifyEmailCode(Email, verificationCode, FirstName, LastName, Password);
  
      if (result.success) {
        alert('Email verified successfully!');
        router.push('/HomePage'); // Redirect to the homepage
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('There was an error verifying the code. Please try again.');
    }
  };

  return (
    <div className="signIn">
      <HeaderAuth isSignIn={false} />

      <main className="main-content">
        <div className="image-section">
          <Image className="login-img" alt="Login Illustration" src={loginImg1} height={600} width={500} />
        </div>
        <div className="login-form-section">
          <h1 className="form-title">Sign Up</h1>
          <p className="form-subtitle">Enter your details below</p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-group">
              <TextField
                label="First Name"
                type="text"
                variant="outlined"
                fullWidth
                id="FirstName"
                value={FirstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <TextField
                label="Last Name"
                type="text"
                variant="outlined"
                fullWidth
                id="LastName"
                value={LastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
              />
            </div>
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
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      {/* Email Verification Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Email Verification</DialogTitle>
        <DialogContent>
          <p>Please enter the verification code sent to your email:</p>
          <OTPInput
            value={verificationCode}
            onChange={setVerificationCode} // Update the OTP state
            numInputs={6} // Number of OTP input fields
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              width: '2rem',
              height: '2rem',
              margin: '0.5rem',
              fontSize: '1.5rem',
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
            focusStyle={{
              border: '1px solid #007bff',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleVerifyCode} variant="contained" color="primary">
            Verify
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SignUp;
