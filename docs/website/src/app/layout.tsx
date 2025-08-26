import '~/styles/globals.css';
import '@cocso-ui/css/colors.css';
import '@cocso-ui/react/styles.css';

import { RootProvider } from 'fumadocs-ui/provider';
import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Layout } from '~/components/layout';
import { SearchDialog } from '~/components/ui';
import { Pretendard } from './_fonts';

export const metadata: Metadata = {
  title: 'cocso-ui',
  description: '',
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={Pretendard.className}>
        <RootProvider search={{ SearchDialog }}>
          <Layout>{children}</Layout>
        </RootProvider>
      </body>
    </html>
  );
};

export default RootLayout;
