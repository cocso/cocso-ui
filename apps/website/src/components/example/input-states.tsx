import { Input } from "@cocso-ui/react";

export default function InputStates() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Input label="With description" description="We'll never share your email." placeholder="Email" />
      <Input error="This field is required." label="With error" placeholder="Required field" />
      <Input disabled label="Disabled" placeholder="Cannot edit" />
    </div>
  );
}
