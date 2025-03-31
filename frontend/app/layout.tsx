import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-black text-[#F1BE48] h-20 text-4xl px-6 sm:px-12 py-4 flex justify-between items-center">
          <Image
            src="./GAPOfficial.png"
            alt="GAP Official logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />

          <div className="flex items-center space-x-4">
            Graduate Admission Portal
          </div>
        </header>

        {children}

        <footer className="bg-black text-[#F1BE48] h-20 text-4xl px-6 sm:px-12 py-4 flex justify-between items-center">
          <Image
            src="./IOWABLACKLogo.png"
            alt="Iowa Logo"
            width={48}
            height={48}
            className="h-12 w-auto"
          />
          <div className="flex items-center space-x-4">
            <Image
              src="./Tigerhawk.png"
              alt="Tiger Hawk"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </div>
        </footer>
        <script src="/client_auth.js" defer></script>
      </body>
    </html>
  );
}
