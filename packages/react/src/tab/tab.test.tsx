import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tab } from '../tab';

describe('Tab', () => {
  describe('rendering', () => {
    it('renders tab triggers in a tablist', () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      expect(screen.getByRole('tablist')).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toBeInTheDocument();
    });

    it('renders tab panels', () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('shows the default selected tab content', () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      expect(screen.getByText('Content 1')).toBeVisible();
    });

    it('marks the default tab as selected', () => {
      render(
        <Tab defaultValue="tab-2">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false');
    });
  });

  describe('behavior', () => {
    it('shows correct content when a tab is clicked', async () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
      expect(screen.getByText('Content 2')).toBeVisible();
    });

    it('updates aria-selected when switching tabs', async () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      await userEvent.click(screen.getByRole('tab', { name: 'Tab 2' }));
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toHaveAttribute('aria-selected', 'false');
    });

    it('navigates tabs with arrow keys', async () => {
      render(
        <Tab defaultValue="tab-1">
          <Tab.List>
            <Tab.Trigger value="tab-1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="tab-2">Tab 2</Tab.Trigger>
          </Tab.List>
          <Tab.Content value="tab-1">Content 1</Tab.Content>
          <Tab.Content value="tab-2">Content 2</Tab.Content>
        </Tab>
      );

      screen.getByRole('tab', { name: 'Tab 1' }).focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });
  });
});
