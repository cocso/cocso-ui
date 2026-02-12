import { Spinner } from '@cocso-ui/react';

export default function SpinnerColor() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Spinner color="primary" />
      <Spinner color="neutral" />
      <div style={{ backgroundColor: '#333', padding: 8, borderRadius: 4 }}>
        <Spinner color="white" />
      </div>
    </div>
  );
}
