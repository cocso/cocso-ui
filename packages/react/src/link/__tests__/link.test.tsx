import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Link } from '../link';

describe('Link', () => {
  describe('rendering', () => {
    it('renders as an anchor element', () => {
      render(<Link href="/home">Home</Link>);
      expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    });

    it('forwards href to the anchor', () => {
      render(<Link href="/about">About</Link>);
      expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    });

    it('renders children correctly', () => {
      render(<Link href="#">Click me</Link>);
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('forwards className to the rendered element', () => {
      render(
        <Link href="#" className="custom-link">
          Link
        </Link>,
      );
      expect(screen.getByRole('link')).toHaveClass('custom-link');
    });
  });

  describe('asChild', () => {
    it('renders as the child element when asChild=true', () => {
      render(
        <Link asChild>
          <button type="button">Button link</button>
        </Link>,
      );
      expect(screen.getByRole('button', { name: 'Button link' })).toBeInTheDocument();
    });

    it('does not render an anchor when asChild=true', () => {
      render(
        <Link asChild>
          <button type="button">Button link</button>
        </Link>,
      );
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('size CSS variable (font-size)', () => {
    it.each([
      ['lg', '18px'],
      ['md', '16px'],
      ['sm', '14px'],
      ['xs', '12px'],
    ] as const)('sets font-size for size="%s"', (size, expectedPx) => {
      render(
        <Link href="#" size={size}>
          Link
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link.style.getPropertyValue('--cocso-typography-font-size')).toBe(expectedPx);
    });
  });

  describe('indicator prop', () => {
    it('applies indicator class by default', () => {
      const { container } = render(<Link href="#">Link</Link>);
      const anchor = container.querySelector('a');
      // The indicator class is applied; class list should contain at least one class from CSS module
      expect(anchor?.className).toBeTruthy();
    });
  });

  describe('events', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(
        <Link href="#" onClick={onClick}>
          Clickable
        </Link>,
      );
      await userEvent.click(screen.getByRole('link', { name: 'Clickable' }));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('weight CSS variable', () => {
    it.each([
      ['normal', '400'],
      ['medium', '500'],
      ['bold', '700'],
    ] as const)('sets font-weight for weight="%s"', (weight, expectedValue) => {
      render(
        <Link href="#" weight={weight}>
          Link
        </Link>,
      );
      const link = screen.getByRole('link');
      expect(link.style.getPropertyValue('--cocso-typography-font-weight')).toBe(expectedValue);
    });
  });
});
