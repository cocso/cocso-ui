import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '../accordion';

describe('Accordion', () => {
  describe('rendering', () => {
    it('renders accordion items', () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByRole('button', { name: /Section 1/i })).toBeInTheDocument();
    });

    it('renders multiple accordion items', () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 2</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      expect(screen.getByRole('button', { name: /Section 1/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Section 2/i })).toBeInTheDocument();
    });

    it('renders chevron icon by default', () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      // chevron is rendered as an SVG inside the trigger
      const trigger = screen.getByRole('button', { name: /Section 1/i });
      expect(trigger.querySelector('svg')).toBeInTheDocument();
    });

    it('does not render chevron when chevron=false', () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger chevron={false}>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: 'Section 1' });
      expect(trigger.querySelector('svg')).not.toBeInTheDocument();
    });
  });

  describe('behavior', () => {
    it('expands item content when trigger is clicked', async () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: /Section 1/i });
      await userEvent.click(trigger);
      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('collapses item content when trigger is clicked again', async () => {
      render(
        <Accordion defaultValue={['item-1']}>
          <Accordion.Item value="item-1">
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: /Section 1/i });
      // Content is initially open; click to close
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('sets aria-expanded on trigger when open', async () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      const trigger = screen.getByRole('button', { name: /Section 1/i });
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('only one item is open at a time by default', async () => {
      render(
        <Accordion>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 1</Accordion.Content>
          </Accordion.Item>
          <Accordion.Item>
            <Accordion.Header>
              <Accordion.Trigger>Section 2</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>Content 2</Accordion.Content>
          </Accordion.Item>
        </Accordion>
      );

      await userEvent.click(screen.getByRole('button', { name: /Section 1/i }));
      await userEvent.click(screen.getByRole('button', { name: /Section 2/i }));

      expect(screen.getByRole('button', { name: /Section 1/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
      expect(screen.getByRole('button', { name: /Section 2/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });
  });
});
