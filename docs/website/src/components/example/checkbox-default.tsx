'use client';

import { Checkbox } from '@cocso-ui/react';
import { useState } from 'react';

export default function CheckboxDefault() {
  const [status, setStatus] = useState<'on' | 'off' | 'intermediate'>('off');

  return (
    <Checkbox
      status={status}
      onChange={(newStatus) => setStatus(newStatus)}
    />
  );
}
