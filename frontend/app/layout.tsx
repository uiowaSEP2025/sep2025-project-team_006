import type { Metadata } from "next";
import { CookiesProvider } from 'next-client-cookies/server';
import { unstable_noStore } from "next/cache";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import React from "react";
import tigerHawk from "../public/Tigerhawk.png";
import gapOffical from "../public/GAPOfficial.png";
import iowaBlackLogo from "../public/IOWABlackLogo.png";
import WebService from "@/api/WebService";
import UserContextProvider from "@/components/UserContextProvider";
import LogoutButton from "@/components/LogoutButton";

const webService = new WebService();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GAP",
  description: "GAP",
};

/*
const getUserInfo = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("gap_token")?.value;
  if (token) {
    const resp = await fetch(webService.AUTH_INFO, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.ok) {
      const json = await resp.json();
      return json.payload;
    }
  }
};
*/

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // this supposedly forces rerendering of the page, which is required
  // as we want to inject the user info on every load
  unstable_noStore();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CookiesProvider>
        <header className="bg-black text-[#F1BE48] h-20 text-4xl px-6 sm:px-12 py-4 flex justify-between items-center">
          <Image
            src={gapOffical}
            alt="GAP Official logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <div className="flex items-center space-x-6">
            <span>Graduate Admission Portal</span>
            <LogoutButton />
          </div>
        </header>
        {children}
        <footer className="bg-black text-[#F1BE48] h-20 text-4xl px-6 sm:px-12 py-4 flex justify-between items-center">
          <Image
            src={iowaBlackLogo}
            alt="Iowa Logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <div className="flex items-center space-x-4">
            <Image
              src={tigerHawk}
              alt="Tiger Hawk"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div>
        </footer>
        </CookiesProvider>
      </body>
    </html>
  );
}
