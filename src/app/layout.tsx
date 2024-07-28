import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import Link from "next/link";
import { PottedPlant } from "@phosphor-icons/react/dist/ssr";
import { BarcodeButton } from "./_components/BarcodeButton";

export const metadata: Metadata = {
  title: "Audrey",
  description: "Food tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const Appheader = () => (
  <header className="bg-green-400 py-4">
    <div className="container">
      <div className="flex justify-between">
        <a href="/" className="flex items-center gap-2 font-bold">
          <PottedPlant size={24} />
          Audrey
        </a>
        <nav>
          <ul className="flex items-center gap-4">
            {[
              {
                href: "/",
                label: "Home",
              },
              {
                href: "/search",
                label: "Search",
              },
              {
                href: "/scan",
                label: "Scan barcode",
              },
            ].map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <Appheader />
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
