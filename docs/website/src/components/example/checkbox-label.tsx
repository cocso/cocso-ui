'use client';

import { Checkbox } from '@cocso-ui/react';

export default function CheckboxLabel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Checkbox status="on" onChange={() => {}} label="이용약관에 동의합니다" />
      <Checkbox status="off" onChange={() => {}} label="마케팅 수신에 동의합니다" />
    </div>
  );
}
