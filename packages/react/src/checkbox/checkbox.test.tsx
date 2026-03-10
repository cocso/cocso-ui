import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders a checkbox', () => {
      render(<Checkbox onChange={vi.fn()} status="off" />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Checkbox label="I agree" onChange={vi.fn()} status="off" />);
      expect(screen.getByText('I agree')).toBeInTheDocument();
    });

    it('associates label with checkbox via htmlFor', () => {
      render(<Checkbox id="test-checkbox" label="I agree" onChange={vi.fn()} status="off" />);
      const label = screen.getByText('I agree');
      expect(label.closest('label')).toHaveAttribute('for', 'test-checkbox');
    });
  });

  describe('status', () => {
    it('is checked when status="on"', () => {
      render(<Checkbox onChange={vi.fn()} status="on" />);
      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('is unchecked when status="off"', () => {
      render(<Checkbox onChange={vi.fn()} status="off" />);
      expect(screen.getByRole('checkbox')).not.toBeChecked();
    });

    it('is indeterminate when status="intermediate"', () => {
      render(<Checkbox onChange={vi.fn()} status="intermediate" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
    });
  });

  describe('onChange', () => {
    it('calls onChange with "on" when clicked from unchecked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} status="off" />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith('on');
    });

    it('calls onChange with "off" when clicked from checked state', async () => {
      const onChange = vi.fn();
      render(<Checkbox onChange={onChange} status="on" />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).toHaveBeenCalledWith('off');
    });
  });

  describe('disabled', () => {
    it('disables the checkbox when disabled=true', () => {
      render(<Checkbox disabled onChange={vi.fn()} status="off" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onChange when disabled and clicked', async () => {
      const onChange = vi.fn();
      render(<Checkbox disabled onChange={onChange} status="off" />);
      await userEvent.click(screen.getByRole('checkbox'));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('size CSS variables', () => {
    it.each(['lg', 'md', 'sm'] as const)('sets size CSS variable for size="%s"', size => {
      const { container } = render(<Checkbox onChange={vi.fn()} size={size} status="off" />);
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.style.getPropertyValue('--cocso-checkbox-size')).toBeTruthy();
    });
  });
});
