import React from "react";
import iconCopyright from "../images/icon-copyright.svg";
import logoSmartKadeRemovebg1 from "../images/logo-smart-kade-removebg-1.png";
import Image from "next/image";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <Image
          className="footer-logo"
          alt="Smart Kade Logo"
          src={logoSmartKadeRemovebg1}
        />
        <div className="footer-section">
          <h3 className="footer-title">Support</h3>
          <address className="footer-address">
            111/A Gonahena, Kadawatha,
            <br />
            Western Province, Sri Lanka
          </address>
          <a href="mailto:smartkadeSupport@gmail.com" className="footer-email">
            smartkadeSupport@gmail.com
          </a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Account</h3>
          <ul className="footer-links">
            <li>
              <a href="#myaccount" className="footer-link">
                My Account
              </a>
            </li>
            <li>
              <a href="#cart" className="footer-link">
                Cart
              </a>
            </li>
            <li>
              <a href="#wishlist" className="footer-link">
                Wishlist
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Quick Link</h3>
          <ul className="footer-links">
            <li>
              <a href="#privacy" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#terms" className="footer-link">
                Terms Of Use
              </a>
            </li>
            <li>
              <a href="#faq" className="footer-link">
                FAQ
              </a>
            </li>
            <li>
              <a href="#contact" className="footer-link">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <Image
          className="icon-copyright"
          alt="Copyright Icon"
          src={iconCopyright}
        />
        <span>Copyright 2024. All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;