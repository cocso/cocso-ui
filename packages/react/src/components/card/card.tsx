import { card } from "@cocso-ui/codegen/generated/card";
import "@cocso-ui/codegen/generated/card.css";
import type { ComponentProps, CSSProperties } from "react";
import { cn } from "../../cn";
import { mergeProps } from "../../primitives/merge-props";
import { type RenderProp, useRender } from "../../primitives/use-render";
import { Typography, type TypographyProps } from "../typography";
import styles from "./card.module.css";

export type CardVariant = "elevated" | "outlined" | "filled" | "glass";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends ComponentProps<"div"> {
  /**
   * Space between the card's children. A number is read as pixels; a string is
   * used as-is. Unset, the children sit flush, as before this prop existed.
   */
  gap?: number | string;
  padding?: CardPadding;
  /**
   * Render the card as another element — `render={<button type="button" />}`
   * or `render={(props) => <NextLink href="…" {...props} />}`. The card's
   * class names, style and children are merged onto it.
   */
  render?: RenderProp;
  variant?: CardVariant;
}

const toLength = (value: number | string) =>
  typeof value === "number" ? `${value}px` : value;

function CardRoot({
  ref,
  render: renderProp,
  className,
  style: _style,
  variant = "elevated",
  padding = "md",
  gap,
  children,
  ...props
}: CardProps) {
  const style = {
    ...(gap === undefined ? {} : { "--cocso-card-gap": toLength(gap) }),
    ..._style,
  } as CSSProperties;

  return useRender({
    render: renderProp,
    ref,
    props: mergeProps<"div">(
      {
        className: cn(
          card({ variant, padding }),
          styles.card,
          variant === "elevated" && styles.elevated,
          variant === "glass" && styles.glass,
          className
        ),
        style,
      },
      props,
      { children }
    ),
    defaultTagName: "div",
  });
}

export type CardHeaderProps = ComponentProps<"div">;

/**
 * The card's top row: a title on the inline-start side, actions on the end.
 * It keeps one height whether or not an action is there, so the content below
 * does not shift when a button comes and goes.
 */
function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cn(styles.header, className)} {...props} />;
}

type HeadingTypographyProps = Extract<TypographyProps, { type: "heading" }>;

export type CardTitleProps = Omit<HeadingTypographyProps, "type">;

/**
 * The card's heading. An `h2` at the `small` heading step by default; pass
 * `level` for a different rank, or `render` for another element.
 */
function CardTitle({
  className,
  size = "small",
  weight = "bold",
  ...props
}: CardTitleProps) {
  return (
    <Typography
      className={cn(styles.title, className)}
      size={size}
      type="heading"
      weight={weight}
      {...props}
    />
  );
}

/**
 * Surface container. Compose with `Card.Header` and `Card.Title`.
 *
 * @example
 * <Card gap={16} variant="outlined">
 *   <Card.Header>
 *     <Card.Title>Monthly revenue</Card.Title>
 *     <Button size="small">Export</Button>
 *   </Card.Header>
 *   …
 * </Card>
 */
export const Card = Object.assign(CardRoot, {
  displayName: "Card" as const,
  Header: CardHeader,
  Title: CardTitle,
});
