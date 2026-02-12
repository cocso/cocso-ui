import { describe, expect, it } from 'vitest';
import { createVarName } from '../naming';

describe('createVarName', () => {
  it('strips $ prefix and replaces dots with hyphens', () => {
    expect(createVarName('$color.primary')).toBe('--color-primary');
  });

  it('handles nested paths', () => {
    expect(createVarName('$color.semantic.primary')).toBe('--color-semantic-primary');
  });

  it('adds prefix when provided', () => {
    expect(createVarName('$color.primary', 'ds')).toBe('--ds-color-primary');
  });

  it('handles name without $ prefix', () => {
    expect(createVarName('color.primary')).toBe('--color-primary');
  });

  it('handles name without $ prefix with custom prefix', () => {
    expect(createVarName('color.primary', 'ds')).toBe('--ds-color-primary');
  });

  it('handles single segment name', () => {
    expect(createVarName('$color')).toBe('--color');
  });

  it('handles name with hyphens', () => {
    expect(createVarName('$my-collection.my-token')).toBe('--my-collection-my-token');
  });

  it('handles name with underscores', () => {
    expect(createVarName('$my_collection.my_token')).toBe('--my_collection-my_token');
  });
});
