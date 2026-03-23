import { StockQuantityStatus } from "@cocso-ui/react";

export default function StockQuantityStatusDefault() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4">
      <StockQuantityStatus quantity="여유" />
      <StockQuantityStatus quantity="보통" />
      <StockQuantityStatus quantity="부족" />
    </div>
  );
}
