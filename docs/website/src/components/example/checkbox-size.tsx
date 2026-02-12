'use client';

import { Checkbox } from '@cocso-ui/react';

export default function CheckboxSize() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Checkbox size="sm" status="on" onChange={() => {}} />
      <Checkbox size="md" status="on" onChange={() => {}} />
      <Checkbox size="lg" status="on" onChange={() => {}} />
    </div>
  );
}
