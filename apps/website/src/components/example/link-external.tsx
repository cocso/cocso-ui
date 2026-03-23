import { Link } from "@cocso-ui/react";

export default function LinkExternal() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Link href="https://example.com" indicator target="_blank" rel="noopener noreferrer">
        External link <Link.ExternalIcon />
      </Link>
    </div>
  );
}
