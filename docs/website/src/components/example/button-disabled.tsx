import { Button } from '@cocso-ui/react';

export default function ButtonDisabled() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button disabled>Disabled</Button>
      <Button variant="secondary" disabled>
        Disabled
      </Button>
    </div>
  );
}
