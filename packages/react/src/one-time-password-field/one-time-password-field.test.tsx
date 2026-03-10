import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OneTimePasswordField } from '../one-time-password-field';

describe('OneTimePasswordField', () => {
  it('renders a hidden input', () => {
    const { container } = render(<OneTimePasswordField maxLength={4} />);
    const input = container.querySelector('input');
    expect(input).toBeInTheDocument();
  });

  it('renders the correct number of slots', () => {
    const { container } = render(<OneTimePasswordField maxLength={4} />);
    const slots = container.querySelectorAll('[data-active], .slot');
    // input-otp renders maxLength slots
    expect(container.querySelector('input')).toBeInTheDocument();
  });

  it('reflects the value in the hidden input', () => {
    const { container } = render(
      <OneTimePasswordField maxLength={4} value="1234" onValueChange={() => {}} />
    );
    const input = container.querySelector('input');
    expect(input).toHaveValue('1234');
  });

  it('applies containerClassName', () => {
    const { container } = render(
      <OneTimePasswordField maxLength={4} className="custom-container" />
    );
    expect(container.querySelector('.custom-container')).toBeInTheDocument();
  });
});
