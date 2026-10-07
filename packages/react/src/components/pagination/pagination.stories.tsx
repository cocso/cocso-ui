import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './pagination';

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onChange: () => {},
    page: 1,
    totalPages: 10,
  },
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

/**
 * Four-digit page numbers.
 *
 * The item box was a fixed 32px square with nothing stopping the label
 * wrapping, so `2269` broke across two lines and the row lost its baseline —
 * invisible to every check, because no story went past two digits. This one
 * holds the fix: the box grows with the number and a single digit stays the
 * same square it was.
 */
export const LargePageNumbers: Story = {
  render: () => {
    const [page, setPage] = useState(2269);
    return <Pagination onChange={setPage} page={page} totalPages={5000} />;
  },
};
