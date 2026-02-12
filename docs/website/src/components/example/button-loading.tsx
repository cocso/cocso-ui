import { Button } from '@cocso-ui/react';

export default function ButtonLoading() {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button loading>Loading</Button>
      <Button variant="secondary" loading>
        Loading
      </Button>
    </div>
  );
}
