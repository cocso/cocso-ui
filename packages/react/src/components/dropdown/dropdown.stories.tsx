import type { Meta, StoryObj } from '@storybook/react';
import { ContentCopyIcon, DeleteIcon, PencilIcon, PersonIcon, SettingsIcon } from '@cocso-ui/react-icons';
import { Button } from '../button';
import { Dropdown } from './dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
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
        <Dropdown.Item prefix={<PencilIcon size={14} />}>편집</Dropdown.Item>
        <Dropdown.Item prefix={<ContentCopyIcon size={14} />}>복사</Dropdown.Item>
        <Dropdown.Item prefix={<PersonIcon size={14} />}>프로필</Dropdown.Item>
        <Dropdown.Item prefix={<SettingsIcon size={14} />}>설정</Dropdown.Item>
        <Dropdown.Item prefix={<DeleteIcon size={14} />}>삭제</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  ),
};
