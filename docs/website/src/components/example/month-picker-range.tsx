'use client';

import { MonthPicker } from '@cocso-ui/react';
import { useState } from 'react';

export default function MonthPickerRange() {
  const [value, setValue] = useState<Date | undefined>(new Date());
  const minDate = new Date(2024, 0, 1);
  const maxDate = new Date(2025, 11, 31);

  return (
    <MonthPicker
      value={value}
      onValueChange={date => setValue(date ?? undefined)}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
}
