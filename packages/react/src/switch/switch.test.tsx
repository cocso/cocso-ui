import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../switch';

describe('Switch', () => {
  describe('rendering', () => {
    it('renders a switch', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Switch label="Notifications" />);
      expect(screen.getByText('Notifications')).toBeInTheDocument();
    });
  });

  describe('checked state', () => {
    it('is on when checked=true', () => {
      render(<Switch checked />);
      expect(screen.getByRole('switch')).toBeChecked();
    });

    it('is off when checked=false', () => {
      render(<Switch checked={false} />);
      expect(screen.getByRole('switch')).not.toBeChecked();
    });
  });

  describe('onCheckedChange', () => {
    it('calls onCheckedChange when clicked', async () => {
      const onCheckedChange = vi.fn();
      render(<Switch onCheckedChange={onCheckedChange} />);
      await userEvent.click(screen.getByRole('switch'));
      expect(onCheckedChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('disabled', () => {
    it('disables the switch when disabled=true', () => {
      render(<Switch disabled />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not call onCheckedChange when disabled and clicked', async () => {
      const onCheckedChange = vi.fn();
      render(<Switch disabled onCheckedChange={onCheckedChange} />);
      await userEvent.click(screen.getByRole('switch'));
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('label position', () => {
    it('renders label after switch by default (position="right")', () => {
      render(<Switch label="Notifications" position="right" />);
      const label = screen.getByText('Notifications');
      const switchEl = screen.getByRole('switch');
      expect(switchEl.compareDocumentPosition(label)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it('renders label before switch when position="left"', () => {
      render(<Switch label="Notifications" position="left" />);
      const label = screen.getByText('Notifications');
      const switchEl = screen.getByRole('switch');
      expect(switchEl.compareDocumentPosition(label)).toBe(Node.DOCUMENT_POSITION_PRECEDING);
    });
  });
});
