import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from '../radio-group';

describe('RadioGroup', () => {
  describe('rendering', () => {
    it('renders a radio group', () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroup.Item value="option-1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('renders multiple radio items', () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-2" aria-label="Option 2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-3" aria-label="Option 3">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      expect(screen.getAllByRole('radio')).toHaveLength(3);
    });

    it('renders with a default value selected', () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="option-2">
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-2" aria-label="Option 2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked();
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
    });

    it('renders radio items as unchecked by default when no defaultValue is set', () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
    });
  });

  describe('behavior', () => {
    it('selects a radio item when clicked', async () => {
      render(
        <RadioGroup aria-label="Options">
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-2" aria-label="Option 2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Option 1' }));
      expect(screen.getByRole('radio', { name: 'Option 1' })).toBeChecked();
    });

    it('deselects the previously selected item when another is clicked', async () => {
      render(
        <RadioGroup aria-label="Options" defaultValue="option-1">
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-2" aria-label="Option 2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Option 2' }));
      expect(screen.getByRole('radio', { name: 'Option 1' })).not.toBeChecked();
      expect(screen.getByRole('radio', { name: 'Option 2' })).toBeChecked();
    });

    it('calls onValueChange when a radio item is selected', async () => {
      const onValueChange = vi.fn();
      render(
        <RadioGroup aria-label="Options" onValueChange={onValueChange}>
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      await userEvent.click(screen.getByRole('radio', { name: 'Option 1' }));
      expect(onValueChange).toHaveBeenCalledWith('option-1');
    });

    it('disables all items when the group is disabled', () => {
      render(
        <RadioGroup aria-label="Options" disabled>
          <RadioGroup.Item value="option-1" aria-label="Option 1">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
          <RadioGroup.Item value="option-2" aria-label="Option 2">
            <RadioGroup.Indicator />
          </RadioGroup.Item>
        </RadioGroup>,
      );

      const radios = screen.getAllByRole('radio');
      for (const radio of radios) {
        expect(radio).toBeDisabled();
      }
    });
  });
});
