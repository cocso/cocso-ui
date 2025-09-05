import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Pagination 컴포넌트는 페이지네이션을 구현하는 컴포넌트입니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    page: {
      description: '현재 페이지 번호',
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    totalPages: {
      description: '총 페이지 수',
      control: 'number',
      table: {
        type: { summary: 'number' },
      },
    },
    maxVisible: {
      description: '표시할 최대 페이지 버튼 수',
      control: 'number',
      table: {
        defaultValue: { summary: '5' },
        type: { summary: 'number' },
      },
    },
    onChange: {
      description: '페이지 변경 시 호출되는 함수',
      action: 'onChange',
      table: {
        type: { summary: '(pageNumber: number) => void' },
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => {
    const [page1, setPage1] = useState(1);
    const [page2, setPage2] = useState(15);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Few Pages (5 total)
          </h4>
          <Pagination page={page1} totalPages={5} onChange={setPage1} />
        </div>

        <div style={{ textAlign: 'center' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>
            Many Pages (100 total)
          </h4>
          <Pagination page={page2} totalPages={100} onChange={setPage2} />
        </div>
      </div>
    );
  },
};

export const Playground: Story = {
  render: args => {
    const [page, setPage] = useState(args.page || 1);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
  args: {
    page: 1,
    totalPages: 10,
    maxVisible: 5,
  },
};
