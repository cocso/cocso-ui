import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Dropdown } from './dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  argTypes: {
    modal: { control: 'boolean' },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">메뉴 열기</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item>편집</Dropdown.Item>
          <Dropdown.Item>복사</Dropdown.Item>
          <Dropdown.Item disabled>비활성화</Dropdown.Item>
          <Dropdown.Item>삭제</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};
