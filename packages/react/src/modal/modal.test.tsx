import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Modal } from '../modal';

describe('Modal', () => {
  describe('trigger rendering', () => {
    it('renders the trigger button', () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
        </Modal>
      );
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    it('does not show dialog content before trigger is clicked', () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>My Modal</Modal.Title>
          </Modal.Content>
        </Modal>
      );
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('open / close behavior', () => {
    it('opens the dialog when trigger is clicked', async () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>Dialog Title</Modal.Title>
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('renders title and description inside the dialog', async () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>My Title</Modal.Title>
            <Modal.Description>My Description</Modal.Description>
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByText('My Title')).toBeInTheDocument();
      expect(screen.getByText('My Description')).toBeInTheDocument();
    });

    it('closes the dialog when the close button is clicked', async () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>Dialog Title</Modal.Title>
            <Modal.Close aria-label="Close dialog" />
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'Close dialog' }));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes the dialog when Escape key is pressed', async () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>Dialog Title</Modal.Title>
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await userEvent.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('controlled mode', () => {
    it('calls onOpenChange when dialog open state changes', async () => {
      const onOpenChange = vi.fn();
      render(
        <Modal onOpenChange={onOpenChange}>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>Dialog</Modal.Title>
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });
  });

  describe('Modal.Close with render', () => {
    it('renders a custom close element via render prop', () => {
      render(
        <Modal defaultOpen>
          <Modal.Content>
            <Modal.Title>Dialog</Modal.Title>
            <Modal.Close render={<button type="button">Custom Close</button>} />
          </Modal.Content>
        </Modal>
      );
      expect(screen.getByRole('button', { name: 'Custom Close' })).toBeInTheDocument();
    });
  });

  describe('portal rendering', () => {
    it('renders dialog content in the document body via portal', async () => {
      render(
        <Modal>
          <Modal.Trigger render={<button type="button">Open</button>} />
          <Modal.Content>
            <Modal.Title>Portal Dialog</Modal.Title>
          </Modal.Content>
        </Modal>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      const dialog = screen.getByRole('dialog');
      expect(document.body.contains(dialog)).toBe(true);
    });
  });
});
