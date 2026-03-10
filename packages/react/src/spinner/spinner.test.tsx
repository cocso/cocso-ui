import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from '../spinner';

describe('Spinner', () => {
  describe('rendering', () => {
    it('renders a div by default', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner.tagName).toBe('DIV');
    });

    it('renders with default size "md" CSS variable', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveStyle({ '--cocso-spinner-size': '24px' });
    });

    it('renders with default color "primary" CSS variable', () => {
      render(<Spinner data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      // border-width default for 'md'
      expect(spinner).toHaveStyle({ '--cocso-spinner-border-width': '3px' });
    });

    it('passes additional props to the underlying element', () => {
      render(<Spinner data-testid="my-spinner" />);
      expect(screen.getByTestId('my-spinner')).toBeInTheDocument();
    });
  });

  describe('size CSS variables', () => {
    it.each([
      ['xl', '40px', '5px'],
      ['lg', '32px', '4px'],
      ['md', '24px', '3px'],
      ['sm', '16px', '2px'],
    ] as const)('sets correct CSS variables for size="%s"', (size, expectedSize, expectedBorderWidth) => {
      render(<Spinner data-testid="spinner" size={size} />);
      const spinner = screen.getByTestId('spinner');
      expect(spinner).toHaveStyle({
        '--cocso-spinner-size': expectedSize,
        '--cocso-spinner-border-width': expectedBorderWidth,
      });
    });
  });

  describe('color CSS variables', () => {
    it('sets CSS variables for color="primary"', () => {
      render(<Spinner color="primary" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      const style = spinner.getAttribute('style') ?? '';
      expect(style).toContain('--cocso-spinner-border-color');
      expect(style).toContain('--cocso-spinner-bg-color');
    });

    it('sets CSS variables for color="neutral"', () => {
      render(<Spinner color="neutral" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      const style = spinner.getAttribute('style') ?? '';
      expect(style).toContain('--cocso-spinner-border-color');
      expect(style).toContain('--cocso-spinner-bg-color');
    });

    it('sets CSS variables for color="white"', () => {
      render(<Spinner color="white" data-testid="spinner" />);
      const spinner = screen.getByTestId('spinner');
      const style = spinner.getAttribute('style') ?? '';
      expect(style).toContain('--cocso-spinner-border-color');
      expect(style).toContain('--cocso-spinner-bg-color');
    });
  });

  describe('render prop', () => {
    it('renders as the provided element when render is given', () => {
      render(
        <Spinner render={<span data-testid="custom-spinner" />} />
      );
      expect(screen.getByTestId('custom-spinner')).toBeInTheDocument();
    });
  });
});
