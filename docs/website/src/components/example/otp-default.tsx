'use client';

import { OneTimePasswordField } from '@cocso-ui/react';

export default function OtpDefault() {
  return (
    <OneTimePasswordField>
      {Array.from({ length: 6 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are fixed-count and never reorder
        <OneTimePasswordField.Input key={index} index={index} />
      ))}
    </OneTimePasswordField>
  );
}
