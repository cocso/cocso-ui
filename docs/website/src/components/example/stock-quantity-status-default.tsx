import { StockQuantityStatus } from '@cocso-ui/react';

export default function StockQuantityStatusDefault() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <StockQuantityStatus quantity="여유" />
      <StockQuantityStatus quantity="보통" />
      <StockQuantityStatus quantity="부족" />
    </div>
  );
}
