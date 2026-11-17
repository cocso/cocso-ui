import { breadcrumb } from "@cocso-ui/codegen/generated/breadcrumb";
import "@cocso-ui/codegen/generated/breadcrumb.css";
import { ChevronRightIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, ReactNode } from "react";
import { Children } from "react";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { type RenderProp, useRender } from "../../primitives/use-render";
import styles from "./breadcrumb.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type BreadcrumbSize = "sm" | "md" | "lg";

/** One step of the path. The last step is the current page and never links. */
export interface BreadcrumbItem {
  /** Where the step leads. A step without one renders as text. */
  href?: string;
  label: ReactNode;
}

export interface BreadcrumbProps extends ComponentProps<"nav"> {
  /**
   * The path from the root to the current page. When given, it is rendered
   * instead of `children`.
   */
  items?: readonly BreadcrumbItem[];
  /**
   * Element each linked step renders as — the router's link, for example
   * `renderLink={(props) => <NextLink {...props} href={props.href ?? ""} />}`.
   * It receives `href`, `className` and `children`. Defaults to `<a>`.
   */
  renderLink?: RenderProp;
  separator?: ReactNode;
  size?: BreadcrumbSize;
}

function BreadcrumbLink({
  href,
  render,
  children,
}: {
  children: ReactNode;
  href: string;
  render?: RenderProp;
}) {
  return useRender({
    render,
    props: mergeProps<"a">({ className: styles.link, href }, { children }),
    defaultTagName: "a",
  });
}

function renderStep(
  item: BreadcrumbItem,
  isCurrent: boolean,
  renderLink: RenderProp | undefined
) {
  if (isCurrent) {
    return <span aria-current="page">{item.label}</span>;
  }

  if (item.href === undefined) {
    return <span>{item.label}</span>;
  }

  return (
    <BreadcrumbLink href={item.href} render={renderLink}>
      {item.label}
    </BreadcrumbLink>
  );
}

/**
 * Navigation hierarchy indicator with configurable separator. Pass the path as
 * `items`, or compose the steps yourself as `children`.
 */
export function Breadcrumb({
  ref,
  className,
  style,
  size = "md",
  separator = <ChevronRightIcon height="1em" width="1em" />,
  items: itemsProp,
  renderLink,
  children,
  ...props
}: BreadcrumbProps) {
  const items =
    itemsProp === undefined
      ? Children.toArray(children)
      : itemsProp.map((item, index) =>
          renderStep(item, index === itemsProp.length - 1, renderLink)
        );

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
