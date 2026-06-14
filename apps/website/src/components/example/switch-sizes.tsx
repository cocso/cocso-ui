import { Switch } from "@cocso-ui/react";

export default function SwitchSizes() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-4 p-4 [&_label]:whitespace-nowrap">
      <Switch defaultChecked label="Large" size="large" />
      <Switch defaultChecked label="Medium" size="medium" />
      <Switch defaultChecked label="Small" size="small" />
    </div>
  );
}
