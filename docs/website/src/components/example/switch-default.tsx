'use client';

import { Switch } from '@cocso-ui/react';
import { useState } from 'react';

export default function SwitchDefault() {
  const [checked, setChecked] = useState(false);

  return <Switch checked={checked} onCheckedChange={setChecked} />;
}
