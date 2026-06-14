"use client";

import { Button, DayPicker } from "@cocso-ui/react";
import { CalendarMonthIcon } from "@cocso-ui/react-icons";
import { useState } from "react";

export default function DayPickerDefault() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <div className="p-4">
      <DayPicker
        onValueChange={setValue}
        trigger={
          <Button prefix={<CalendarMonthIcon size={16} />} variant="outline">
            {value ? value.toLocaleDateString("ko-KR") : "Select date"}
          </Button>
        }
        value={value ?? undefined}
      />
    </div>
  );
}
