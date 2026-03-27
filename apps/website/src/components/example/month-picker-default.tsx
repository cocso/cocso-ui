"use client";

import { Button, MonthPicker } from "@cocso-ui/react";
import { CalendarMonthIcon } from "@cocso-ui/react-icons";
import { useState } from "react";

export default function MonthPickerDefault() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <div className="p-4">
      <MonthPicker
        onValueChange={setValue}
        trigger={
          <Button prefix={<CalendarMonthIcon size={16} />} variant="outline">
            {value
              ? value.toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                })
              : "Select month"}
          </Button>
        }
        value={value ?? undefined}
      />
    </div>
  );
}
