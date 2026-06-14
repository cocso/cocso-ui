import { StockQuantityStatus } from "@cocso-ui/react";

export default function StockQuantityStatusDefault() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <StockQuantityStatus quantity="sufficient" />
      <StockQuantityStatus quantity="normal" />
      <StockQuantityStatus quantity="insufficient" />
    </div>
  );
}
