import { Link } from "@cocso-ui/react";

export default function LinkDefault() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Link href="#" variant="inline">
        Inline link
      </Link>
      <Link href="#" variant="current">
        Current link
      </Link>
      <Link href="#" variant="plain">
        Plain link
      </Link>
    </div>
  );
}
