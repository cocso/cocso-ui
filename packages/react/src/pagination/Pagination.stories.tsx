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

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={10} onChange={setPage} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination page={page} totalPages={5} onChange={setPage} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(15);
    return <Pagination page={page} totalPages={100} onChange={setPage} />;
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
