import { Input } from "@cocso-ui/react";

export default function InputDefault() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-4">
      <Input label="Email" placeholder="Enter your email" />
    </div>
  );
}
