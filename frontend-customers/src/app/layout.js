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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <CartProvider>
         {children}
        </CartProvider>
      </body>
    </html>
  );
}
