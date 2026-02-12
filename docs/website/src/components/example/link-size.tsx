import { Link } from '@cocso-ui/react';

export default function LinkSize() {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Link href="#" size="xs">
        XSmall
      </Link>
      <Link href="#" size="sm">
        Small
      </Link>
      <Link href="#" size="md">
        Medium
      </Link>
      <Link href="#" size="lg">
        Large
      </Link>
    </div>
  );
}
