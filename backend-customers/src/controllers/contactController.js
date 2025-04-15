const nodemailer = require('nodemailer');
require('dotenv').config();

// Controller to handle contact form submissions
exports.submitContactForm = async (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validate the input
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Example: Send an email using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false, // Allow self-signed certificates
        },
      });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Your email to receive the contact form submissions
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'There was an error sending your message. Please try again later.' });
  }
};