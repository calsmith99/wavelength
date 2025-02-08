import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "~/server/auth";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Wavelength",
  description: "View and compare your music taste with your friends",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth(); // Fetch the session

  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <SessionProvider session={session}> {/* Wrap with SessionProvider */}
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}