import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from '../dropdown';

describe('Dropdown', () => {
  describe('rendering', () => {
    it('renders the trigger button', () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item 1</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      expect(screen.getByRole('button', { name: 'Open Menu' })).toBeInTheDocument();
    });

    it('does not show content before the trigger is clicked', () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item 1</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      expect(screen.queryByRole('menuitem', { name: 'Item 1' })).not.toBeInTheDocument();
    });
  });

  describe('open/close behavior', () => {
    it('opens the dropdown and shows items when trigger is clicked', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item 1</Dropdown.Item>
              <Dropdown.Item>Item 2</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      expect(screen.getByRole('menuitem', { name: 'Item 1' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Item 2' })).toBeInTheDocument();
    });

    it('renders the dropdown menu in document.body via Portal', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Portal Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      const item = screen.getByRole('menuitem', { name: 'Portal Item' });
      expect(document.body).toContainElement(item);
    });
  });

  describe('item interactions', () => {
    it('calls onSelect handler when an item is clicked', async () => {
      const onSelect = vi.fn();
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item onSelect={onSelect}>Action</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      await userEvent.click(screen.getByRole('menuitem', { name: 'Action' }));
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('closes the dropdown after an item is selected', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Close Me</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      expect(screen.getByRole('menuitem', { name: 'Close Me' })).toBeInTheDocument();
      await userEvent.click(screen.getByRole('menuitem', { name: 'Close Me' }));
      expect(screen.queryByRole('menuitem', { name: 'Close Me' })).not.toBeInTheDocument();
    });

    it('renders multiple items and each is accessible', async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Edit</Dropdown.Item>
              <Dropdown.Item>Delete</Dropdown.Item>
              <Dropdown.Item>Share</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Share' })).toBeInTheDocument();
    });
  });

  describe('controlled state', () => {
    it('respects onOpenChange callback', async () => {
      const onOpenChange = vi.fn();
      render(
        <Dropdown onOpenChange={onOpenChange}>
          <Dropdown.Trigger asChild>
            <button>Open Menu</button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content>
              <Dropdown.Item>Item</Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open Menu' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
