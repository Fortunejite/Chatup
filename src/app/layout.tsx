import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProivider from "@/components/AuthProvider";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <AuthProivider>
        <body className={inter.className}>
          <ToastContainer />
          {children}
        </body>
      </AuthProivider>
    </html>
  );
}
