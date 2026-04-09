import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Raleway } from "next/font/google";
import "./globals.css";
import { APP_COLOR, APP_DESCRIPTION, APP_NAME } from "@/constant";
import TanStackQueryProvider from "@/providers/TanStackQueryProvider";
import { Toaster } from "@/components/ui/sonner";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} - APP`,
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${raleway.className}  antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader
          color={`${{ APP_COLOR }}`}
          initialPosition={0.08}
          crawlSpeed={200}
          height={5}
          easing="ease"
          speed={200}
          zIndex={1600}
        />
        <NuqsAdapter>
          <TanStackQueryProvider>{children}</TanStackQueryProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
