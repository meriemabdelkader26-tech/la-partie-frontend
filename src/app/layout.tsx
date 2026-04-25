import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Raleway } from "next/font/google";
import "./globals.css";
import { APP_COLOR, APP_DESCRIPTION, APP_NAME } from "@/constant";
import TanStackQueryProvider from "@/providers/TanStackQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import { Chatbot } from "./_components/Chatbot";

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
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
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
          <TanStackQueryProvider>
            {children}
            <Chatbot />
          </TanStackQueryProvider>
        </NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
