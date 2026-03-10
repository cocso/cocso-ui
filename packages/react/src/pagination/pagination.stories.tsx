import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  argTypes: {
    totalPages: { control: { type: 'number', min: 1, max: 100 } },
    maxVisible: { control: { type: 'number', min: 3, max: 10 } },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination onChange={setPage} page={page} totalPages={10} />;
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination onChange={setPage} page={page} totalPages={50} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination onChange={setPage} page={page} totalPages={3} />;
  },
};
