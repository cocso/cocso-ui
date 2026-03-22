import { Field, Input } from "@cocso-ui/react";

export default function FieldDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Field label="Email" description="We'll never share your email.">
        <Input placeholder="Enter your email" />
      </Field>
      <Field label="Password" required error="Password must be at least 8 characters.">
        <Input placeholder="Enter password" type="password" />
      </Field>
    </div>
  );
}
