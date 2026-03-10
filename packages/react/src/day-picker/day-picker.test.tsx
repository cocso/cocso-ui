import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DayPicker } from '../day-picker';

describe('DayPicker', () => {
  describe('rendering', () => {
    it('renders the root container', () => {
      const { container } = render(
        <DayPicker>
          <button>Select date</button>
        </DayPicker>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders the trigger child element', () => {
      render(
        <DayPicker>
          <button>Select date</button>
        </DayPicker>
      );
      expect(screen.getByRole('button', { name: 'Select date' })).toBeInTheDocument();
    });

    it('does not show the calendar before the trigger is clicked', () => {
      render(
        <DayPicker>
          <button>Select date</button>
        </DayPicker>
      );
      expect(screen.queryByLabelText('날짜 선택')).not.toBeInTheDocument();
    });
  });

  describe('calendar open/close', () => {
    it('opens the calendar dropdown when the trigger is clicked', async () => {
      render(
        <DayPicker>
          <button>Select date</button>
        </DayPicker>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Select date' }));
      expect(screen.getByLabelText('날짜 선택')).toBeInTheDocument();
    });

    it('renders the inline calendar after opening', async () => {
      render(
        <DayPicker>
          <button>Select date</button>
        </DayPicker>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Select date' }));
      // react-datepicker renders a calendar table
      expect(document.querySelector('.react-datepicker')).toBeInTheDocument();
    });
  });

  describe('value prop', () => {
    it('accepts a value prop without throwing', () => {
      const date = new Date(2024, 0, 15);
      expect(() =>
        render(
          <DayPicker value={date}>
            <button>Select date</button>
          </DayPicker>
        )
      ).not.toThrow();
    });
  });

  describe('onValueChange', () => {
    it('calls onValueChange when a date is selected', async () => {
      const onValueChange = vi.fn();
      render(
        <DayPicker onValueChange={onValueChange}>
          <button>Select date</button>
        </DayPicker>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Select date' }));

      // Click any enabled day cell in the calendar
      const dayCell = document.querySelector(
        '.react-datepicker__day:not(.react-datepicker__day--disabled)'
      ) as HTMLElement | null;

      expect(dayCell).not.toBeNull();
      await userEvent.click(dayCell!);
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled state', () => {
    it('renders without throwing when disabled=true', () => {
      expect(() =>
        render(
          <DayPicker disabled>
            <button>Select date</button>
          </DayPicker>
        )
      ).not.toThrow();
    });

    it('renders the trigger button when disabled', () => {
      render(
        <DayPicker disabled>
          <button>Select date</button>
        </DayPicker>
      );
      expect(screen.getByRole('button', { name: 'Select date' })).toBeInTheDocument();
    });
  });

  describe('date constraints', () => {
    it('accepts minDate and maxDate without throwing', () => {
      const min = new Date(2024, 0, 1);
      const max = new Date(2024, 11, 31);
      expect(() =>
        render(
          <DayPicker maxDate={max} minDate={min}>
            <button>Select date</button>
          </DayPicker>
        )
      ).not.toThrow();
    });
  });
});
