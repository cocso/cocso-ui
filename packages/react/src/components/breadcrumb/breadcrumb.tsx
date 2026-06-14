import { breadcrumb } from "@cocso-ui/codegen/generated/breadcrumb";
import "@cocso-ui/codegen/generated/breadcrumb.css";
import { ChevronRightIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, ReactNode } from "react";
import { Children } from "react";
import { cn } from "../../cn";
import styles from "./breadcrumb.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type BreadcrumbSize = "sm" | "md" | "lg";

export interface BreadcrumbProps extends ComponentProps<"nav"> {
  separator?: ReactNode;
  size?: BreadcrumbSize;
}

/** Navigation hierarchy indicator with configurable separator. */
export function Breadcrumb({
  ref,
  className,
  style,
  size = "md",
  separator = <ChevronRightIcon height="1em" width="1em" />,
  children,
  ...props
}: BreadcrumbProps) {
  const items = Children.toArray(children);

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(breadcrumb({ size }), styles.breadcrumb, className)}
      ref={ref}
      style={style}
      {...props}
    >
      <ol className={styles.list}>
        {items.map((child, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumb items are ordered children without reordering
          <li className={styles.item} key={index}>
            {child}
            {index < items.length - 1 && (
              <span aria-hidden="true" className={styles.separator}>
                {separator}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
