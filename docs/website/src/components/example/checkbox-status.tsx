'use client';

import { Checkbox } from '@cocso-ui/react';

export default function CheckboxStatus() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Checkbox status="off" onChange={() => {}} />
      <Checkbox status="on" onChange={() => {}} />
      <Checkbox status="intermediate" onChange={() => {}} />
    </div>
  );
}
