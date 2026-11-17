---
"@cocso-ui/react": minor
---

New components ported from the COCSO web apps' internal UI package, rebuilt on cocso tokens with accessible names, keyboard support and contrast-checked colours:

- `EmptyState`: a dashed frame for an empty, loading or failed region outside a table, with an optional title, description, leading content and action.
- `SelectionChip`: a pill toggle above a multi-select list that selects or clears a group at once (`aria-pressed`).
- `LoadingOverlay`: a fixed full-viewport layer with a spinner and message that blocks pointer input while a long task runs.
- `CopyButton`: an icon button that copies `text` to the clipboard and briefly shows a check mark; overridable labels and success/error callbacks.
- `SegmentedControl`: one choice among 2–3 options in a pill track, a radio group operable with Tab and the arrow keys.
- `NumberInput`: an `Input` for amounts that groups thousands as you type, keeps the caret in place and reports `number | null`.
- `FormField`: a label beside its control on one line, stacking on phones, with the label tied to the control (`FormField.Label`, `.Input`, `.InputTrigger`, `.Value`, `useFormField`).
- `SectionHeader`: a section heading with actions on the same line that fold behind a toggle when the row gets narrow.
- `InfoPopover`: an info icon that opens a labelled explanation in a Popover.
- `SummaryCard`: a dashboard figure with icon, label and a value that can link to the list behind it.
- `FileUploader`: a drag-and-drop or click-to-pick area on a real, keyboard-reachable file input; checks type, size and count and lists chosen files as removable `FileRow`s.
