import "./globals.css";
import "@cocso-ui/css/token.css";
import "@cocso-ui/react/styles.css";

import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import type { PropsWithChildren } from "react";
import { Toaster } from "@cocso-ui/react";
import type { Locale } from "~/libs/i18n";
import { i18n } from "~/libs/i18n";
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

const RootLayout = async ({ children }: PropsWithChildren) => {
  const headersList = await headers();
  const lang = (headersList.get("x-locale") ?? i18n.defaultLanguage) as Locale;

  return (
    <html dir="ltr" lang={lang} suppressHydrationWarning>
      <head>
        <link crossOrigin="anonymous" href="https://cdn.jsdelivr.net" rel="preconnect" />
      </head>
      <body className={GeistMono.variable}>
        <RootProvider search={{ SearchDialog }} theme={{ forcedTheme: "light" }}>
          <Layout>{children}</Layout>
          <Toaster position="top-center" />
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
