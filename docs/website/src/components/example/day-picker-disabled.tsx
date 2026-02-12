'use client';

import { DayPicker } from '@cocso-ui/react';

export default function DayPickerDisabled() {
  return <DayPicker value={new Date()} disabled />;
}
