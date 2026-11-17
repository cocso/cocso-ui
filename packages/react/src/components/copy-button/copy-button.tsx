"use client";

import { CheckIcon, ContentCopyIcon } from "@cocso-ui/react-icons";
import { type MouseEvent, useEffect, useState } from "react";
import { Button, type ButtonProps } from "../button";

export interface CopyButtonProps
  extends Omit<ButtonProps, "children" | "svgOnly"> {
  /** Accessible name once the copy succeeded. Defaults to "복사됨". */
  copiedLabel?: string;
  /** Accessible name and tooltip of the button. Defaults to "복사". */
  label?: string;
  /** Called with the error when the copy fails — permission denied, insecure context. */
  onCopyError?: (error: unknown) => void;
  /** Called with the copied text after a successful copy. */
  onCopySuccess?: (text: string) => void;
  /** How long the check mark stays after a successful copy, in seconds. Defaults to 2. */
  resetTimeoutSeconds?: number;
  /** The text written to the clipboard. */
  text: string;
}

/**
 * An icon button that copies `text` to the clipboard and shows a check mark
 * for a moment.
 *
 * It uses `navigator.clipboard.writeText`, which only works in a secure
 * context (HTTPS or localhost). A failure is reported through `onCopyError`
 * and nowhere else — the library does not log.
 */
export function CopyButton({
  text,
  resetTimeoutSeconds = 2,
  onCopySuccess,
  onCopyError,
  label = "복사",
  copiedLabel = "복사됨",
  onClick,
  size = "x-small",
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }
    const timer = setTimeout(() => {
      setIsCopied(false);
    }, resetTimeoutSeconds * 1000);
    return () => clearTimeout(timer);
  }, [isCopied, resetTimeoutSeconds]);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopySuccess?.(text);
    } catch (error) {
      onCopyError?.(error);
    }
  };

  return (
    <Button
      aria-label={isCopied ? copiedLabel : label}
      data-cocso-component="copy-button"
      data-copied={isCopied || undefined}
      size={size}
      svgOnly
      title={label}
      type="button"
      variant={variant}
      {...props}
      onClick={handleClick}
    >
      {isCopied ? <CheckIcon /> : <ContentCopyIcon />}
    </Button>
  );
}
