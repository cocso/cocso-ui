'use client';

import { Switch } from '@cocso-ui/react';

export default function SwitchLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Switch label="알림 수신" position="right" />
      <Switch label="다크 모드" position="left" />
    </div>
  );
}
