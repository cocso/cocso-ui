import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

export const metadata: Metadata = {
  title: 'cocso-ui',
  description: '',
};

const RootLayout = async ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
