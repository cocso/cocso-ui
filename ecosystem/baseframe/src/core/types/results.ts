import type { Value } from './domain';

export interface ParseResult {
  isValid: boolean;
  value?: Value;
  error?: string;
}

export interface ValidationError {
  type:
    | 'INVALID_COLLECTION'
    | 'MISSING_MODE'
    | 'INVALID_TOKEN_FORMAT'
    | 'INVALID_VALUE_FORMAT'
    | 'INVALID_PRIMITIVE_TOKEN';
  message: string;
  tokenName?: string;
  collection?: string;
  mode?: string;
  value?: string | number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: string[];
}
