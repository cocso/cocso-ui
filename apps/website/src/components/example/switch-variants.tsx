import { Switch } from "@cocso-ui/react";

export default function SwitchVariants() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-4 p-4 [&_label]:whitespace-nowrap">
      <Switch defaultChecked label="Primary" variant="primary" />
      <Switch defaultChecked label="Success" variant="success" />
      <Switch defaultChecked label="Error" variant="error" />
      <Switch defaultChecked label="Warning" variant="warning" />
      <Switch defaultChecked label="Info" variant="info" />
    </div>
  );
}
