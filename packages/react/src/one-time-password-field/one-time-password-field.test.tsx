import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OneTimePasswordField } from '../one-time-password-field';

describe('OneTimePasswordField', () => {
  describe('rendering', () => {
    it('renders the root container as a group', () => {
      render(
        <OneTimePasswordField maxLength={6}>
          <OneTimePasswordField.Input index={0} />
        </OneTimePasswordField>
      );
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('renders the correct number of input cells for maxLength=6', () => {
      render(
        <OneTimePasswordField maxLength={6}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
          <OneTimePasswordField.Input index={4} />
          <OneTimePasswordField.Input index={5} />
        </OneTimePasswordField>
      );
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);
    });

    it('renders a 4-digit OTP field with 4 inputs', () => {
      render(
        <OneTimePasswordField maxLength={4}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(4);
    });

    it('labels each input with accessible aria-label', () => {
      render(
        <OneTimePasswordField maxLength={4}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      expect(screen.getByRole('textbox', { name: 'Character 1 of 4' })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: 'Character 2 of 4' })).toBeInTheDocument();
    });
  });

  describe('input behavior', () => {
    it('accepts text input into the first cell', async () => {
      render(
        <OneTimePasswordField maxLength={6}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
          <OneTimePasswordField.Input index={4} />
          <OneTimePasswordField.Input index={5} />
        </OneTimePasswordField>
      );
      const first = screen.getByRole('textbox', { name: 'Character 1 of 6' });
      await userEvent.click(first);
      await userEvent.type(first, '1');
      expect(first).toHaveValue('1');
    });

    it('each input has inputmode numeric', () => {
      render(
        <OneTimePasswordField maxLength={4}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      const inputs = screen.getAllByRole('textbox');
      for (const input of inputs) {
        expect(input).toHaveAttribute('inputmode', 'numeric');
      }
    });
  });

  describe('disabled state', () => {
    it('disables all input cells when the root is disabled', () => {
      render(
        <OneTimePasswordField disabled maxLength={4}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      const inputs = screen.getAllByRole('textbox');
      for (const input of inputs) {
        expect(input).toBeDisabled();
      }
    });

    it('does not accept input when disabled', async () => {
      render(
        <OneTimePasswordField disabled maxLength={4}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      const first = screen.getByRole('textbox', { name: 'Character 1 of 4' });
      await userEvent.click(first);
      await userEvent.type(first, '5');
      expect(first).toHaveValue('');
    });
  });

  describe('onChange callback', () => {
    it('calls onChange when value changes', async () => {
      const onChange = vi.fn();
      render(
        <OneTimePasswordField maxLength={4} onChange={onChange}>
          <OneTimePasswordField.Input index={0} />
          <OneTimePasswordField.Input index={1} />
          <OneTimePasswordField.Input index={2} />
          <OneTimePasswordField.Input index={3} />
        </OneTimePasswordField>
      );
      const first = screen.getByRole('textbox', { name: 'Character 1 of 4' });
      await userEvent.click(first);
      await userEvent.type(first, '1');
      expect(onChange).toHaveBeenCalled();
    });
  });
});
