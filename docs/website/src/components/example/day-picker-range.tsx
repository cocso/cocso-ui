'use client';

import { DayPicker } from '@cocso-ui/react';
import { useState } from 'react';

export default function DayPickerRange() {
  const [value, setValue] = useState<Date | undefined>(new Date());
  const today = new Date();
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());

  return (
    <DayPicker
      value={value}
      onValueChange={date => setValue(date ?? undefined)}
      minDate={today}
      maxDate={maxDate}
    />
  );
}
