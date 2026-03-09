import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from '../popover';

describe('Popover', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      expect(screen.getByRole('button', { name: 'Open Popover' })).toBeInTheDocument();
    });

    it('does not show content before the trigger is clicked', () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });
  });

  describe('open/close behavior', () => {
    it('opens the popover and shows content when trigger is clicked', async () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Popover' }));
      expect(screen.getByText('Popover content')).toBeInTheDocument();
    });

    it('renders content in document.body via Portal', async () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Portal content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Popover' }));
      const content = screen.getByText('Portal content');
      expect(document.body).toContainElement(content);
    });

    it('closes the popover when trigger is clicked again', async () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      const trigger = screen.getByRole('button', { name: 'Open Popover' });
      await userEvent.click(trigger);
      expect(screen.getByText('Popover content')).toBeInTheDocument();
      await userEvent.click(trigger);
      expect(screen.queryByText('Popover content')).not.toBeInTheDocument();
    });

    it('sets aria-expanded on trigger when open', async () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      const trigger = screen.getByRole('button', { name: 'Open Popover' });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('controlled state', () => {
    it('respects onOpenChange callback', async () => {
      const onOpenChange = vi.fn();
      render(
        <Popover onOpenChange={onOpenChange}>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>Popover content</Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Popover' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    it('renders popover content with custom children', async () => {
      render(
        <Popover>
          <Popover.Trigger asChild>
            <button>Open Popover</button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content>
              <p>Rich content</p>
              <button>Action</button>
            </Popover.Content>
          </Popover.Portal>
        </Popover>,
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Popover' }));
      expect(screen.getByText('Rich content')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });
});
