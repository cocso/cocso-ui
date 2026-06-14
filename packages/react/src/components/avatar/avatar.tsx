import { avatar } from "@cocso-ui/codegen/generated/avatar";
import "@cocso-ui/codegen/generated/avatar.css";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./avatar.module.css";

/** Inline type aliases — codegen is a devDependency and must not leak into published .d.ts */
export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "square";

export interface AvatarProps extends ComponentProps<"div"> {
  alt?: string;
  fallback?: string;
  shape?: AvatarShape;
  size?: AvatarSize;
  src?: string;
}

/** User or entity visual identifier with image, initials fallback, or icon. */
export function Avatar({
  ref,
  className,
  style,
  size = "md",
  shape = "circle",
  src,
  alt,
  fallback,
  children,
  ...props
}: AvatarProps) {
  const initials = fallback ?? alt?.charAt(0).toUpperCase();

  function renderContent() {
    if (src) {
      // biome-ignore lint/correctness/useImageSize: avatar image is sized by CSS (100% width/height)
      return <img alt={alt ?? ""} className={styles.image} src={src} />;
    }
    if (initials) {
      return <span className={styles.fallback}>{initials}</span>;
    }
    return children;
  }

  return (
    <div
      className={cn(avatar({ size, shape }), styles.avatar, className)}
      ref={ref}
      style={style}
      {...props}
    >
      {renderContent()}
    </div>
  );
}
