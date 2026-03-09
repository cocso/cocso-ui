import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders a checkbox', () => {
      render(<Checkbox status="off" onChange={vi.fn()} />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Checkbox status="off" onChange={vi.fn()} label="I agree" />);
      expect(screen.getByText('I agree')).toBeInTheDocument();
    });

    it('associates label with checkbox via htmlFor', () => {
      render(<Checkbox status="off" onChange={vi.fn()} label="I agree" />);
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('I agree');
      expect(label.closest('label')).toHaveAttribute('for', checkbox.id);
    });
  });

  describe('status', () => {
    it('is checked when status="on"', () => {
      render(<Checkbox status="on" onChange={vi.fn()} />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('is unchecked when status="off"', () => {
      render(<Checkbox status="off" onChange={vi.fn()} />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('is indeterminate when status="intermediate"', () => {
      render(<Checkbox status="intermediate" onChange={vi.fn()} />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('onChange', () => {
    it('calls onChange with "on" when clicked from unchecked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox status="off" onChange={onChange} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith('on');
    });

    it('calls onChange with "off" when clicked from checked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox status="on" onChange={onChange} />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith('off');
    });
  });

  describe('disabled', () => {
    it('disables the checkbox when disabled=true', () => {
      render(<Checkbox status="off" onChange={vi.fn()} disabled />);
      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('does not call onChange when disabled and clicked', async () => {
      const onChange = vi.fn();
      render(<Checkbox status="off" onChange={onChange} disabled />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('size CSS variables', () => {
    it.each(['lg', 'md', 'sm'] as const)('sets size CSS variable for size="%s"', (size) => {
      const { container } = render(<Checkbox status="off" onChange={vi.fn()} size={size} />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--cocso-checkbox-size')).toBeTruthy();
    });
  });
});
