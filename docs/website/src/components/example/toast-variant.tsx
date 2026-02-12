'use client';

import { Button, Toaster, toast } from '@cocso-ui/react';

export default function ToastVariant() {
  return (
    <>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Button variant="secondary" onClick={() => toast('기본 알림입니다.')}>Default</Button>
        <Button variant="secondary" onClick={() => toast.success('성공적으로 저장되었습니다.')}>Success</Button>
        <Button variant="secondary" onClick={() => toast.error('오류가 발생했습니다.')}>Error</Button>
        <Button variant="secondary" onClick={() => toast.warning('주의가 필요합니다.')}>Warning</Button>
        <Button variant="secondary" onClick={() => toast.info('참고 정보입니다.')}>Info</Button>
      </div>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
