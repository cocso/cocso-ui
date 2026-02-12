'use client';

import { DayPicker } from '@cocso-ui/react';
import { useState } from 'react';

export default function DayPickerDefault() {
  const [value, setValue] = useState<Date | undefined>(new Date());

  return <DayPicker value={value} onValueChange={date => setValue(date ?? undefined)} />;
}
