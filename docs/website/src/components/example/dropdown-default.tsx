'use client';

import { Button, Dropdown } from '@cocso-ui/react';

export default function DropdownDefault() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">메뉴 열기</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item>프로필</Dropdown.Item>
          <Dropdown.Item>설정</Dropdown.Item>
          <Dropdown.Item>로그아웃</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  );
}
