import { Spinner } from "@cocso-ui/react";

export default function SpinnerDefault() {
  return (
    <div className="flex flex-wrap items-center gap-6 p-4">
      <Spinner size="large" />
      <Spinner size="medium" />
      <Spinner size="small" />
    </div>
  );
}
