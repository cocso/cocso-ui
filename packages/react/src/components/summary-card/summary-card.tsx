import { ArrowIOSForwardIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { type RenderProp, useRender } from "../../primitives/use-render";
import { Typography } from "../typography";
import styles from "./summary-card.module.css";

export interface SummaryCardProps extends ComponentProps<"div"> {
  /** Leading icon. Decorative — the label carries the meaning. */
  icon?: ReactNode;
  /** What the figure counts, in a few words. */
  label: ReactNode;
}

function SummaryCardRoot({
  className,
  icon,
  label,
  children,
  ...props
}: SummaryCardProps) {
  return (
    <div
      className={cn(styles.root, className)}
      data-cocso-component="summary-card"
      {...props}
    >
      <div className={styles.header}>
        {icon && (
          <span aria-hidden="true" className={styles.icon}>
            {icon}
          </span>
        )}
        <span className={styles.label}>{label}</span>
      </div>
      {children}
    </div>
  );
}

export interface SummaryCardValueProps
  extends Omit<ComponentProps<"a">, "children"> {
  /** The figure. */
  count: number | string;
  /**
   * Where the figure leads — the list it counts. Without one (and without
   * `render`) the figure is plain text.
   */
  href?: string;
  /**
   * Element the linked figure renders as — the router's link, for example
   * `render={(props) => <NextLink {...props} href={props.href ?? ""} />}`.
   * It receives `href`, `className` and `children`. Defaults to `<a>`.
   */
  render?: RenderProp;
  /** Unit after the figure, e.g. `"건"` or `"%"`. */
  suffix?: ReactNode;
}

const VALUE_HOOK = { "data-cocso-component": "summary-card-value" };

function SummaryCardValue({
  className,
  count,
  href,
  render,
  suffix,
  ...props
}: SummaryCardValueProps) {
  const linked = href !== undefined || render !== undefined;
  const element = useRender({
    render,
    props: mergeProps<"a">(
      {
        ...VALUE_HOOK,
        className: cn(styles.value, linked && styles.link, className),
        href,
        children: (
          <>
            {count}
            {suffix}
            {linked && (
              <ArrowIOSForwardIcon
                aria-hidden="true"
                className={styles.chevron}
                size={16}
              />
            )}
          </>
        ),
      },
      props
    ),
    defaultTagName: linked ? "a" : "span",
  });
  // Typography sets the figure's size and weight, so it follows the type
  // scale (including its responsive steps) rather than a copied number.
  return <Typography render={element} size="large" type="body" weight="bold" />;
}

/**
 * One headline figure on a dashboard: what it counts, the figure, and —
 * usually — a link through to the list behind it.
 *
 * The root paints no surface. Put it in a `Card` where it should read as a
 * card; a grid of four on a plain page does not need one.
 *
 * @example
 * <SummaryCard icon={<PersonIcon />} label="New users">
 *   <SummaryCard.Value count={42} href="/users" />
 * </SummaryCard>
 */
export const SummaryCard = Object.assign(SummaryCardRoot, {
  Value: SummaryCardValue,
});
