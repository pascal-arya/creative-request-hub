import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
// 1. IMPORT THE NAVBAR COMPONENT
import Navbar from "./components/Navbar";

// Configure Poppins: Italic, weights 400 and 700
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["italic"],
  variable: "--font-poppins"
});

export const metadata: Metadata = {
  title: "DWDG Creative Hub",
  description: "Act through Structure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the font variable and your black background default */}
      <body className={`${poppins.className} bg-white text-[#000503]`}>
        {/* 2. PLACE THE NAVBAR HERE */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}