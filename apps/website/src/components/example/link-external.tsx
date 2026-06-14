import { Link } from "@cocso-ui/react";

export default function LinkExternal() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Link
        href="https://example.com"
        indicator
        rel="noopener noreferrer"
        target="_blank"
      >
        External link <Link.ExternalIcon />
      </Link>
    </div>
  );
}
