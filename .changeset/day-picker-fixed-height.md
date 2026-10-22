---
"@cocso-ui/react": patch
---

The DayPicker and DateTimePicker panels no longer jump above its trigger while paging months.

A month spans five or six weeks, so the calendar's height changed as you paged. When the taller month left too little room below the trigger, the Popover positioner flipped the panel above it — mid-interaction, under the pointer that had just pressed "next". The calendar now always draws six weeks (trailing days of the next month fill the sixth row, as leading and trailing days already do), so its height is constant and it stays where it opened. DateTimePicker draws the same calendar and gets the same fix.
