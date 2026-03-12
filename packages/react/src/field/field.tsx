import { createContext, type ReactNode, useContext, useId } from "react";
import styles from "./field.module.css";

interface FieldContextValue {
  descriptionId?: string;
  errorId?: string;
}

const FieldContext = createContext<FieldContextValue>({});

/** Returns the nearest {@link Field} context, providing IDs for description and error elements. */
export const useField = () => useContext(FieldContext);

/** Props for the {@link Field} component. */
export interface FieldProps {
  /** The form control(s) managed by this field. */
  children: ReactNode;
  /** Helper text shown below the control when there is no error. */
  description?: string;
  /** Error message shown below the control; hides description when set. */
  error?: string;
  /** The `id` of the associated form control, forwarded to the `<label>` element. */
  htmlFor?: string;
  /** Label text displayed above the control. */
  label: string;
  /** When `false`, an "(선택)" optional badge is appended to the label. */
  required?: boolean;
}

/** A form field wrapper that renders a label, helper description, and error message around a control. */
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
