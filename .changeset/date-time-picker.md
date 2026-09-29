---
"@cocso-ui/react": minor
---

`DateTimePicker`: a date and a time from one trigger and one popover, beside `DayPicker` and `MonthPicker`. A date click keeps the popover open — a date alone is not a value — and `onValueChange` fires when the time is picked. `minDate`/`maxDate` bound the time list on their own day only, so a caller does not compute `minTime`/`maxTime` for every other day. Props follow `DayPicker`'s, plus `timeCaption`, `timeIntervals`, `minTime`, `maxTime` and `filterTime`.
