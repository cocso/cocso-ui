import { card } from "@cocso-ui/codegen/generated/card";
import "@cocso-ui/codegen/generated/card.css";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./card.module.css";

export type CardVariant = "elevated" | "outlined" | "filled";
export type CardPadding = "sm" | "md" | "lg";

export interface CardProps extends ComponentProps<"div"> {
  padding?: CardPadding;
  variant?: CardVariant;
}

export function Card({
  ref,
  className,
  style,
  variant = "elevated",
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(card({ variant, padding }), styles.card, className)}
      ref={ref}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
}
