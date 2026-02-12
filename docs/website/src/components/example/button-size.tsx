import { Button } from '@cocso-ui/react';

export default function ButtonSize() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Button size="xs">XSmall</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  );
}
