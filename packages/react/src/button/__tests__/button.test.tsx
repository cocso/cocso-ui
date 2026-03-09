import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Button>Click</Button>);
      expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
    });

    it('applies the given type attribute', () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('renders prefix', () => {
      render(<Button prefix={<span data-testid="prefix-icon" />}>Button</Button>);
      expect(screen.getByTestId('prefix-icon')).toBeInTheDocument();
    });

    it('renders suffix', () => {
      render(<Button suffix={<span data-testid="suffix-icon" />}>Button</Button>);
      expect(screen.getByTestId('suffix-icon')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('disables the button when loading=true', () => {
      render(<Button loading>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders Spinner when loading=true', () => {
      render(<Button loading>Button</Button>);
      // Spinner is rendered as a div styled with CSS variables
      const button = screen.getByRole('button');
      const spinner = button.querySelector('[style*="--cocso-spinner-size"]');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('disabled state', () => {
    it('disables the button when disabled=true', () => {
      render(<Button disabled>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('does not call onClick when disabled', async () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Button
        </Button>,
      );
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it('calls onClick when clicked', async () => {
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Button</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('asChild', () => {
    it('renders as the child element when asChild=true', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>,
      );
      expect(screen.getByRole('link', { name: 'Link Button' })).toBeInTheDocument();
    });

    it('throws when asChild receives a non-element child', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      expect(() => render(<Button asChild>plain text</Button>)).toThrow();
      consoleError.mockRestore();
    });
  });

  describe('size CSS variables', () => {
    it.each([
      ['xl', '56px'],
      ['lg', '48px'],
      ['md', '40px'],
      ['sm', '32px'],
      ['xs', '28px'],
    ] as const)('sets height to %s when size="%s"', (size, expectedHeight) => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole('button')).toHaveStyle({ '--cocso-button-height': expectedHeight });
    });
  });
});
