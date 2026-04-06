import { Card } from "@cocso-ui/react";

export default function CardDefault() {
  return (
    <div className="p-4">
      <Card style={{ width: 320 }}>
        <h3 className="font-semibold">Card Title</h3>
        <p className="mt-1 text-neutral-500 text-sm">
          This is a card with default elevated style and medium padding.
        </p>
      </Card>
    </div>
  );
}
