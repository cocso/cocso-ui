import { MoreHorizIcon } from '@cocso-ui/react-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Dropdown } from './Dropdown';

const meta = {
  title: 'Components/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Dropdown 컴포넌트는 메뉴나 옵션 목록을 표시하는 드롭다운입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    modal: {
      description: '모달 모드 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: '가장 기본적인 Dropdown 사용법입니다. 버튼을 클릭하면 메뉴가 열립니다.' } },
  },
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="secondary">메뉴 열기</Button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content>
          <Dropdown.Item>메뉴 아이템 1</Dropdown.Item>
          <Dropdown.Item>메뉴 아이템 2</Dropdown.Item>
          <Dropdown.Item>메뉴 아이템 3</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown>
  ),
};

export const IconTrigger: Story = {
  parameters: {
    controls: { disable: true },
    docs: { description: { story: '아이콘 버튼을 트리거로 사용하는 드롭다운입니다. 비활성화된 항목도 포함됩니다.' } },
  },
  render: () => (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="tertiary" svgOnly>
          <MoreHorizIcon />
        </Button>
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

export const Playground: Story = {
  args: {
    modal: false,
  },
};
