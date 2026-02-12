'use client';

import { Button, Popover } from '@cocso-ui/react';

export default function PopoverDefault() {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="secondary">정보 보기</Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content>
          <p>Popover 내부에 표시할 콘텐츠입니다.</p>
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
}
