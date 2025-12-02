import '~/app/globals.css';
import '@cocso-ui/css/token.css';
import '@cocso-ui/react/styles.css';

import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata, Viewport } from 'next';
import type { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';
import { Layout } from '~/components/layout';
import { SearchDialog } from '~/components/ui';
import { GeistMono, GoogleSansFlex, Pretendard } from './_fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://cocso-ui.com'),
  title: { default: 'cocso-ui', template: '%s | cocso-ui' },
  description: 'Documentation for the COCSO UI component library.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  return (
    <html lang="ko" dir="ltr" suppressHydrationWarning>
      <body className={twMerge(Pretendard.variable, GeistMono.variable, GoogleSansFlex.variable)}>
        <RootProvider search={{ SearchDialog }} theme={{ enabled: false }}>
          <Layout>{children}</Layout>
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
