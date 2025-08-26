import '~/styles/globals.css';

import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from '~/components/layout';

export const metadata: Metadata = {
  title: 'cocso-ui',
  description: '',
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <RootProvider>
          <Layout>{children}</Layout>
          {/*<div className="fade" data-side="left" aria-hidden="true" />*/}
          {/*<div className="fade" data-side="right" aria-hidden="true" />*/}
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
