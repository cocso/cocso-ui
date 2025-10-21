import '~/styles/globals.css';
import '@cocso-ui/css/token.css';
import '@cocso-ui/react/styles.css';

import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import type { PropsWithChildren } from 'react';
import { Layout } from '~/components/layout';
import { SearchDialog } from '~/components/ui';
import { Pretendard } from './_fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://cocso-ui.com'),
  title: { default: 'cocso-ui', template: '%s | cocso-ui' },
  description: 'Documentation for the COCSO UI component library.',
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  return (
    <ViewTransitions>
      <html lang="ko" dir="ltr" suppressHydrationWarning>
        <body className={Pretendard.className}>
          <RootProvider theme={{ enabled: false }} search={{ SearchDialog }}>
            <Layout>{children}</Layout>
          </RootProvider>
        </body>
      </html>
    </ViewTransitions>
  );
};

export default RootLayout;
