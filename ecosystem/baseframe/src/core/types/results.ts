import type { Value } from './domain';

export interface ParseResult {
  error?: string;
  isValid: boolean;
  value?: Value;
}

export interface ValidationError {
  collection?: string;
  message: string;
  mode?: string;
  tokenName?: string;
  type:
    | 'INVALID_COLLECTION'
    | 'MISSING_MODE'
    | 'INVALID_TOKEN_FORMAT'
    | 'INVALID_VALUE_FORMAT'
    | 'INVALID_PRIMITIVE_TOKEN';
  value?: string | number;
}

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
  warnings: string[];
}
