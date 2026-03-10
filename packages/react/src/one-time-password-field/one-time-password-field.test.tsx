// TODO: These tests are stubs. The full implementation will be added when
// @radix-ui/react-one-time-password-field is replaced with a proper alternative.
// See: https://github.com/mui/base-ui/issues/75
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OneTimePasswordField } from '../one-time-password-field';

describe('OneTimePasswordField (stub)', () => {
  it('renders a container', () => {
    render(
      <OneTimePasswordField maxLength={4}>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders multiple input cells', () => {
    render(
      <OneTimePasswordField maxLength={4}>
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(4);
  });
});
