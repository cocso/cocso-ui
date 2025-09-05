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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
    </div>
  ),
};

export const Playground: Story = {
  args: {
    modal: false,
  },
};
