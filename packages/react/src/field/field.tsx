import type { ReactNode } from "react";
import styles from "./field.module.css";

export interface FieldProps {
  children: ReactNode;
  description?: string;
  error?: string;
  htmlFor?: string;
  label: string;
  required?: boolean;
}

export function Field({
  children,
  label,
  htmlFor,
  required,
  error,
  description,
}: FieldProps) {
  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required === false && (
          <span className={styles.optional}>(선택)</span>
        )}
      </label>
      {children}
      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : description ? (
        <p className={styles.description}>{description}</p>
      ) : null}
    </div>
  );
}
