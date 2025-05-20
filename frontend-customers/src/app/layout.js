import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from '@/contexts/CartContext';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Kade - Your Smart Shopping Experience",
  description: "Smart Kade - Your Smart Shopping Experience",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="//code.tidio.co/r1kai5la4svul8ilyo2oddzhwbcukqe7.js" async></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider>
         {children}
        </CartProvider>
      </body>
    </html>
  );
}
