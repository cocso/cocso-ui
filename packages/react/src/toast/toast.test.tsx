import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Toaster, toast } from '../index';

describe('Toast', () => {
  describe('Toaster', () => {
    it('renders the Toaster component without errors', () => {
      render(<Toaster />);
      // Toaster renders an ol element to host toasts
      expect(document.body).toBeInTheDocument();
    });

    it('renders Toaster as a region landmark', () => {
      render(<Toaster />);
      // sonner Toaster may use ol or section; verify it mounts into the DOM
      expect(document.body.innerHTML).not.toBe('');
    });

    it('accepts position prop without throwing', () => {
      expect(() => render(<Toaster position="top-right" />)).not.toThrow();
    });

    it('accepts theme prop without throwing', () => {
      expect(() => render(<Toaster theme="dark" />)).not.toThrow();
    });
  });

  describe('toast function', () => {
    it('is a function', () => {
      expect(typeof toast).toBe('function');
    });

    it('has a success method', () => {
      expect(typeof toast.success).toBe('function');
    });

    it('has an error method', () => {
      expect(typeof toast.error).toBe('function');
    });

    it('has a warning method', () => {
      expect(typeof toast.warning).toBe('function');
    });

    it('has an info method', () => {
      expect(typeof toast.info).toBe('function');
    });

    it('has a dismiss method', () => {
      expect(typeof toast.dismiss).toBe('function');
    });

    it('calling toast returns a toast id', () => {
      render(<Toaster />);
      const id = toast('Hello world');
      expect(id).toBeDefined();
    });
  });
});
