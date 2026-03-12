import { type ReactNode, useId } from "react";
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
  const descriptionId = useId();
  const errorId = useId();

  return (
    <div className={styles.root}>
      <label className={styles.label} htmlFor={htmlFor}>
        {label}
        {required === false && <span className={styles.optional}>(선택)</span>}
      </label>
      {children}
      {error && (
        <p className={styles.errorMessage} id={errorId}>
          {error}
        </p>
      )}
      {!error && description && (
        <p className={styles.description} id={descriptionId}>
          {description}
        </p>
      )}
    </div>
  );
}
