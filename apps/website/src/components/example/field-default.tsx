import { Field, Input } from "@cocso-ui/react";

export default function FieldDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Field description="We'll never share your email." label="Email">
        <Input placeholder="Enter your email" />
      </Field>
      <Field
        error="Password must be at least 8 characters."
        label="Password"
        required
      >
        <Input placeholder="Enter password" type="password" />
      </Field>
    </div>
  );
}
