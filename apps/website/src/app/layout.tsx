import "./globals.css";
import "@cocso-ui/css/token.css";
import "@cocso-ui/react/styles.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import type { PropsWithChildren } from "react";
import { RootLayout as Layout } from "~/components/layout/root";
import { DefaultSearchDialog as SearchDialog } from "~/components/ui/search";

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cocso-ui.com"),
  title: { default: "cocso-ui", template: "%s | cocso-ui" },
  description: "Documentation for the COCSO UI component library.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html dir="ltr" lang="ko" suppressHydrationWarning>
      <head>
        <link crossOrigin="anonymous" href="https://cdn.jsdelivr.net" rel="preconnect" />
      </head>
      <body className={GeistMono.variable}>
        <RootProvider search={{ SearchDialog }} theme={{ forcedTheme: "light" }}>
          <Layout>{children}</Layout>
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
