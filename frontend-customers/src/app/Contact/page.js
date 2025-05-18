'use client';

import React, { useState } from 'react';
import { Header } from "@/components/Header";
import Image from "next/image";
import Footer from '@/components/Footer';
import mail from '@/images/icons-mail.svg';
import phone from '@/images/icons-phone.svg';
import Divider from '@mui/material/Divider';
import { Button, TextField } from "@mui/material";
import { submitContactForm } from '@/services/contactService';
import AlertComponent from '@/components/AlertComponent';
import '@/styles/Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    
      const [alert, setAlert] = useState({ severity: '', title: '', message: '' });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await submitContactForm(formData);
          setAlert({ severity: 'success', title: 'Success', message: response.message });
          setFormData({ name: '', email: '', phone: '', message: '' }); // Clear the form
        } catch (error) {          
          setAlert({ severity: 'error', title: 'Error', message: error.message });
        }
      };

      const closeAlert = () => {
        setAlert({ severity: '', title: '', message: '' });
    };

  return (
    <div className="contact-all">
      <Header/>
      <main className="main-contact-content">

        <div className='contact'>
            <div className='phone'>
                <div className='icon'>
                    <Image className='phone-icon' alt='phone icon' src={phone} height={30} width={30}/><p>Call to us</p>
                </div>                 
                <p>We are available 24/7, 7 days a week</p>
                <p>Phone: +94 77 123 4567</p>                
            </div>
            <Divider variant="middle" />
            <div className='mail'>
                <div className='icon'>
                    <Image className='mail-icon' alt='mail icon' src={mail} height={30} width={30}/><p>Write to us</p>
                </div>
                <p>Fill out our form and we will contact you <br/> within 24 hours.</p>
                <p>Email: customer@smartkade.com</p>
                <p>Email: support@smartkade.com</p>
            </div>
        </div>

        <div className='contact-form'>
        <form onSubmit={handleSubmit}>
            <div className='customer-details'>
                <div className='customer-details-text'>
                    <TextField 
                        label="Name"
                        name="name"
                        type="text"
                        variant="outlined"
                        required 
                        value={formData.name}
                        onChange={handleChange}                 
                    />
                </div>
                <div className='customer-details-text'>
                    <TextField 
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className='customer-details-text'>
                    <TextField 
                        label="Phone"
                        name="phone"
                        type="text"
                        variant="outlined"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <TextField 
                label="Message"
                name="message"
                type="text"
                variant="outlined"
                required
                fullWidth
                multiline
                rows={4}  
                value={formData.message}
                onChange={handleChange}                
            />

            <Button variant="contained" className="form-button" type="submit"> Send Message </Button>  
        </form>   
        </div>         
        
        
      </main>  
      <Footer />
      {alert.message && (
            <AlertComponent
                severity={alert.severity}
                title={alert.title}
                message={alert.message}
                onClose={closeAlert}
                sx={{ width: '25%', position: 'fixed', top: '10%', left: '75%', zIndex: 9999 }}
            />
        )}
    </div>
  );
};

export default Contact;
