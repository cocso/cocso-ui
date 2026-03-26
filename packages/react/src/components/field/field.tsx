import { createContext, type ReactNode, useContext, useId } from "react";
import styles from "./field.module.css";

interface FieldContextValue {
  descriptionId?: string;
  errorId?: string;
}

const FieldContext = createContext<FieldContextValue>({});
export const useField = () => useContext(FieldContext);

export interface FieldProps {
  children: ReactNode;
  description?: string;
  error?: string;
  htmlFor?: string;
  label: string;
  /**
   * `true` = required field (no indicator shown).
   * `false` = explicitly optional — shows "(선택)" indicator.
   * `undefined` = no indicator shown.
   */
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
    <FieldContext.Provider
      value={{
        descriptionId: !error && description ? descriptionId : undefined,
        errorId: error ? errorId : undefined,
      }}
    >
      <div className={styles.root}>
        <label className={styles.label} htmlFor={htmlFor}>
          {label}
          {required === false && (
            <span className={styles.optional}>(선택)</span>
          )}
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
    </FieldContext.Provider>
  );
}
