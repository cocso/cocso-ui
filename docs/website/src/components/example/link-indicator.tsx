import { Link } from '@cocso-ui/react';

export default function LinkIndicator() {
  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <Link href="#">밑줄 있음</Link>
      <Link href="#" indicator={false}>
        밑줄 없음
      </Link>
    </div>
  );
}
