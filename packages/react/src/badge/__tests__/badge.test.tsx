import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('accepts additional className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      expect(screen.getByText('Badge').closest('div')).toHaveClass('custom-class');
    });
  });

  describe('variant CSS variables', () => {
    it.each(['default', 'danger', 'primary', 'success', 'warning'] as const)(
      'sets background color CSS variable for variant="%s"',
      (variant) => {
        const { container } = render(<Badge variant={variant}>Badge</Badge>);
        const badge = container.firstChild as HTMLElement;
        expect(badge.style.getPropertyValue('--cocso-badge-bg-color')).toBeTruthy();
      },
    );

    it('defaults to variant="default"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue('--cocso-badge-bg-color')).toBeTruthy();
    });
  });

  describe('size CSS variables', () => {
    it.each([
      ['sm', '4px 8px'],
      ['md', '6px 10px'],
      ['lg', '8px 12px'],
    ] as const)('sets padding to "%s" when size="%s"', (size, expectedPadding) => {
      const { container } = render(<Badge size={size}>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue('--cocso-badge-padding')).toBe(expectedPadding);
    });

    it('defaults to size="md"', () => {
      const { container } = render(<Badge>Badge</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.style.getPropertyValue('--cocso-badge-padding')).toBe('6px 10px');
    });
  });
});
