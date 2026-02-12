'use client';

import { OneTimePasswordField } from '@cocso-ui/react';

export default function OtpDefault() {
  return (
    <OneTimePasswordField>
      {Array.from({ length: 6 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length OTP field
        <OneTimePasswordField.Input key={index} index={index} />
      ))}
    </OneTimePasswordField>
  );
}
