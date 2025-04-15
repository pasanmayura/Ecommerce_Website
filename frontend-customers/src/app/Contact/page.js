'use client';

import React from 'react';
import { Header } from "@/components/Header";
import Image from "next/image";
import Footer from '@/components/Footer';
import mail from '@/images/icons-mail.svg';
import phone from '@/images/icons-phone.svg';
import Divider from '@mui/material/Divider';
import { Button, TextField } from "@mui/material";
import '@/styles/Contact.css';

const Contact = () => {

  return (
    <div className="common">
      <Header isHomePage={true}/>
      <main className="main-content">

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
            <div className='customer-details'>
                <div className='customer-details-text'>
                    <TextField 
                        label="Name"
                        type="text"
                        variant="outlined"
                        required                  
                    />
                </div>
                <div className='customer-details-text'>
                    <TextField 
                        label="Email"
                        type="email"
                        variant="outlined"
                        required
                    />
                </div>
                <div className='customer-details-text'>
                    <TextField 
                        label="Phone"
                        type="text"
                        variant="outlined"
                        required
                    />
                </div>
            </div>

            <TextField 
                label="Message"
                type="text"
                variant="outlined"
                required
                multiline
                rows={4}                  
            />

            <Button variant="contained" className="form-button" type="submit"> Send Message </Button>        
        </div>         
        
        
      </main>  
      <Footer />
    </div>
  );
};

export default Contact;
