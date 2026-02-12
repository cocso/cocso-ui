'use client';

import { Switch } from '@cocso-ui/react';

export default function SwitchSize() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Switch size="sm" />
      <Switch size="md" />
    </div>
  );
}
