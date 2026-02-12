'use client';

import { MonthPicker } from '@cocso-ui/react';
import { useState } from 'react';

export default function MonthPickerDefault() {
  const [value, setValue] = useState<Date | undefined>(new Date());

  return (
    <MonthPicker
      value={value}
      onValueChange={(date) => setValue(date ?? undefined)}
    />
  );
}
