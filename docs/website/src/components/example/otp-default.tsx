'use client';

import { OneTimePasswordField } from '@cocso-ui/react';

export default function OtpDefault() {
  return (
    <OneTimePasswordField>
      {Array.from({ length: 6 }, (_, index) => (
        <OneTimePasswordField.Input key={index} index={index} />
      ))}
    </OneTimePasswordField>
  );
}
