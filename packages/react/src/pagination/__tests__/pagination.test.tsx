import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from '../pagination';

describe('Pagination', () => {
  describe('rendering', () => {
    it('renders page buttons up to totalPages', () => {
      render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    });

    it('does not render arrow buttons when totalPages=1', () => {
      render(<Pagination page={1} totalPages={1} onChange={vi.fn()} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(1);
    });
  });

  describe('prev / next arrows', () => {
    it('disables the prev button on the first page', () => {
      render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.at(0)).toBeDisabled();
    });

    it('disables the next button on the last page', () => {
      render(<Pagination page={5} totalPages={5} onChange={vi.fn()} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons.at(-1)).toBeDisabled();
    });

    it('calls onChange with page-1 when prev is clicked', async () => {
      const onChange = vi.fn();
      render(<Pagination page={3} totalPages={5} onChange={onChange} />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons.at(0)!);
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it('calls onChange with page+1 when next is clicked', async () => {
      const onChange = vi.fn();
      render(<Pagination page={3} totalPages={5} onChange={onChange} />);
      const buttons = screen.getAllByRole('button');
      await userEvent.click(buttons.at(-1)!);
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  describe('page button click', () => {
    it('calls onChange with the clicked page number', async () => {
      const onChange = vi.fn();
      render(<Pagination page={1} totalPages={5} onChange={onChange} />);
      await userEvent.click(screen.getByRole('button', { name: '3' }));
      expect(onChange).toHaveBeenCalledWith(3);
    });
  });

  describe('truncation', () => {
    it('always renders first and last page buttons when totalPages > maxVisible + 2', () => {
      render(<Pagination page={5} totalPages={10} onChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
    });

    it('renders all page buttons when totalPages <= maxVisible + 2', () => {
      render(<Pagination page={1} totalPages={7} onChange={vi.fn()} />);
      for (let i = 1; i <= 7; i++) {
        expect(screen.getByRole('button', { name: String(i) })).toBeInTheDocument();
      }
    });

    it('respects the maxVisible prop', () => {
      render(<Pagination page={1} totalPages={4} maxVisible={3} onChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    });
  });

  describe('active page indicator', () => {
    it('sets data-active=true on the current page button', () => {
      render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('data-active', 'true');
    });

    it('sets data-active=false on non-current page buttons', () => {
      render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
      expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('data-active', 'false');
    });
  });
});
