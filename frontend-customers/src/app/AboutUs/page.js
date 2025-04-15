'use client';

import React, {useEffect} from 'react';
import { Header } from "@/components/Header";
import Image from "next/image";
import footerTop from '@/images/footerTop.png';
import aboutusimg from '@/images/aboutus.png'
import Footer from '@/components/Footer';
import visionImg from '@/images/vision.png';
import missionImg from '@/images/mission.png';
import AOS from "aos";
import "aos/dist/aos.css";
import '@/styles/AboutUs.css';

const AboutUs = () => {

  useEffect(() => {
      AOS.init({
        duration: 1000,  // Slow animation 
        easing: 'ease-in-out',
        once: false,  // Animation runs every time element enters viewport
        mirror: true, // Ensures animation happens when scrolling up & down
      });
  }); 

  return (
    <div className="AboutUs">
      <Header isHomePage={true}/>
      <main className="main-about-content">
        <h1 className='story'>Our Story</h1>
        <div className='story-content'>
            <div className='story-text'>
                <p> SMART KADE started with a simple idea – to make online shopping easier and more accessible for everyone. 
                    As someone passionate about technology and e-commerce, our founder, who currently works at Dialog, wanted 
                    to create a platform that brings quality products to customers at affordable prices. <br/><br/>

                    Based in Gonahena, Kadawatha, SMART KADE began as a small initiative to help local sellers connect with 
                    buyers. Over time, we expanded, offering a wide range of products while ensuring a smooth and secure 
                    shopping experience. Our goal is to provide convenience, reliability, and excellent customer service, 
                    making online shopping hassle-free for all. <br/><br/>

                    At SMART KADE, we believe in innovation, customer satisfaction, and trust. Every product we offer is 
                    carefully selected, and we continuously improve our services to meet your needs. Join us on this journey 
                    and experience the future of online shopping with SMART KADE!
                </p>
            </div>
            <div className='story-image'>
              <Image className='aboutusImg' alt='aboutus image' src={aboutusimg} height={500} width={500}/>
            </div>
        </div>
        <div className='vision-mission' data-aos="fade-up">
          <div className='vision'>
            <h2>Vision</h2><br/>
              <div>
                <p>To become a trusted and innovative e-commerce platform that connects 
                  people with quality products at affordable prices, making online shopping 
                  simple, secure, and enjoyable for everyone in Sri Lanka and beyond.
                </p>
              </div>
              <div>
                <Image className='visionImg' alt='vision image' src={visionImg} height={200} width={200}/>
              </div>
          </div>
          <div className='mission'>
            <h2>Mission</h2><br/>
            <div>
              <p>
                At SMART KADE, our mission is to provide a secure, affordable, and hassle-free online 
                shopping experience. We support local businesses by giving them a platform to grow while 
                ensuring quality products, fast transactions, and excellent customer service. Through 
                innovation and trust, we strive to make online shopping easy and reliable for everyone.
              </p>
            </div>
            <div>
              <Image className='missionImg' alt='mission image' src={missionImg} height={200} width={200}/>
            </div>
          </div>
        </div>  
        <div className='footerTop-img' data-aos="fade-up">
          <center>
            <Image 
              src={footerTop} 
              alt="footerTop"
              style={{display:'flex', width:'80%', height:'auto', marginTop:'20px'}} />
          </center>
        </div>
        

          
        <Footer />
      </main>
      
    </div>
  );
};

export default AboutUs;
