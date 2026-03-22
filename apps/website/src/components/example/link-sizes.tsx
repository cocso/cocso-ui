import { Link } from "@cocso-ui/react";

export default function LinkSizes() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Link href="#" size="large">Large link</Link>
      <Link href="#" size="medium">Medium link</Link>
      <Link href="#" size="small">Small link</Link>
      <Link href="#" size="x-small">X-Small link</Link>
    </div>
  );
}
