import "../globals.css";
import "@cocso-ui/css/token.css";
import "@cocso-ui/react/styles.css";

import { Toaster } from "@cocso-ui/react";
import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";
import { RootLayout as Layout } from "~/components/layout/root";
import { DefaultSearchDialog as SearchDialog } from "~/components/ui/search";
import { i18n } from "~/libs/i18n";

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

interface LayoutProps extends PropsWithChildren {
  params: Promise<{ lang: string }>;
}

const RootLayout = async ({ children, params }: LayoutProps) => {
  const { lang } = await params;

  if (!(i18n.languages as readonly string[]).includes(lang)) {
    notFound();
  }

  return (
    <html dir="ltr" lang={lang} suppressHydrationWarning>
      <head>
        <link
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net"
          rel="preconnect"
        />
      </head>
      <body className={GeistMono.variable}>
        <RootProvider
          search={{ SearchDialog }}
          theme={{ forcedTheme: "light" }}
        >
          <Layout>{children}</Layout>
          <Toaster position="top-center" />
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
