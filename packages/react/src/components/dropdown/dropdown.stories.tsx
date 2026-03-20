import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Dropdown } from './dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    modal: { control: 'boolean' },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger render={<Button variant="outline">메뉴 열기</Button>} />
      <Dropdown.Content>
        <Dropdown.Item>편집</Dropdown.Item>
        <Dropdown.Item>복사</Dropdown.Item>
        <Dropdown.Item>붙여넣기</Dropdown.Item>
        <Dropdown.Item disabled>비활성화</Dropdown.Item>
        <Dropdown.Item>삭제</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <Dropdown>
      <Dropdown.Trigger render={<Button variant="outline">더보기</Button>} />
      <Dropdown.Content>
        <Dropdown.Item>프로필 편집</Dropdown.Item>
        <Dropdown.Item>설정</Dropdown.Item>
        <Dropdown.Item>로그아웃</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
