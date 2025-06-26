import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layouts/navbar";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProviderWrapper } from "@/components/providers/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SecureShare - Share Secrets Securely",
  description:
    "Send sensitive information with confidence. Your secrets are encrypted, automatically expire, and can be viewed only once.",
  keywords: ["secure", "secrets", "encryption", "private", "share"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        <TRPCReactProvider>
          <ThemeProviderWrapper>
            <Navbar session={session} />
            {children}
          </ThemeProviderWrapper>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
