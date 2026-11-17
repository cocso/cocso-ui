"use client";

import type { CSSProperties, ReactNode } from "react";
import { useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "../../cn";
import { Radio } from "../../primitives/radio";
import { RadioGroup } from "../../primitives/radio-group";
import styles from "./segmented-control.module.css";

export type SegmentedControlSize = "medium" | "small";

export interface SegmentedControlOption<T extends string> {
  /**
   * One line under the label. When any option has one, every segment grows to
   * two lines so the control keeps a single height.
   */
  description?: string;
  label: string;
  value: T;
}

export interface SegmentedControlProps<T extends string> {
  /** Names the group. One of this or `aria-labelledby` is required for a screen reader to say what is being chosen. */
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /**
   * Applied to the outermost element: the wrapper when `description` is set,
   * the track otherwise.
   */
  className?: string;
  /** A line under the control that applies to every option. Linked with `aria-describedby`. */
  description?: ReactNode;
  disabled?: boolean;
  /**
   * Sizes each segment to its label instead of splitting the track evenly. The
   * selection indicator is measured and follows the selected segment.
   */
  fitContent?: boolean;
  onChange: (value: T) => void;
  options: readonly SegmentedControlOption<T>[];
  /**
   * `medium` is 32px, the height of a `small` `Input`; `small` is 28px, the
   * height of an `x-small` one.
   */
  size?: SegmentedControlSize;
  /**
   * The selected value. Typed `string` rather than `T` so a caller holding a
   * wider value (`String(field.value)`) does not need a cast; a value matching
   * no option selects nothing.
   */
  value: string;
}

interface IndicatorBox {
  size: number;
  start: number;
}

/**
 * A single choice among two or three options, drawn as one pill-shaped track.
 *
 * Built on Base UI's radio group, so it is a `radiogroup` of `radio`s: Tab
 * reaches the selected segment and the arrow keys move the selection, the way
 * a set of radio buttons behaves.
 */
export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  description,
  className,
  disabled = false,
  fitContent = false,
  size = "medium",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: SegmentedControlProps<T>) {
  const descriptionId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState<IndicatorBox | null>(null);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const hasDescription = options.some((option) => option.description);

  // Only the content-width mode measures: an even split is pure CSS.
  useLayoutEffect(() => {
    if (!fitContent) {
      return;
    }
    const track = trackRef.current;
    if (!track) {
      return;
    }
    const measure = () => {
      const segment =
        track.querySelectorAll<HTMLElement>('[role="radio"]')[
          Math.max(selectedIndex, 0)
        ];
      if (!segment) {
        return;
      }
      // `offsetLeft` is physical; the indicator is placed on the inline axis
      // so it lands on the right segment when the direction flips.
      const rtl = getComputedStyle(track).direction === "rtl";
      const start = rtl
        ? track.clientWidth - segment.offsetLeft - segment.offsetWidth
        : segment.offsetLeft;
      setMeasured({ start, size: segment.offsetWidth });
    };
    measure();
    // Label widths change when a web font loads or the container resizes.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [fitContent, selectedIndex]);

  // In content-width mode the indicator is not rendered until it has been
  // measured: a first style has nothing to transition from, so it appears in
  // place instead of growing in from the track's edge on every mount.
  const showIndicator = !fitContent || measured !== null;

  const indicatorStyle = (
    fitContent
      ? measured && {
          "--segmented-control-indicator-start": `${measured.start}px`,
          "--segmented-control-indicator-size": `${measured.size}px`,
        }
      : {
          "--segmented-control-count": options.length,
          "--segmented-control-index": Math.max(selectedIndex, 0),
        }
  ) as CSSProperties | undefined;

  const control = (
    <RadioGroup
      aria-describedby={description ? descriptionId : undefined}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(
        styles.track,
        styles[size],
        fitContent ? styles.fit : styles.even,
        hasDescription && styles.twoLine,
        !description && className
      )}
      data-cocso-component="segmented-control"
      disabled={disabled}
      onValueChange={(next) => onChange(next as T)}
      ref={trackRef}
      value={value}
    >
      {showIndicator && (
        <span
          aria-hidden
          className={cn(
            styles.indicator,
            selectedIndex < 0 && styles.indicatorHidden
          )}
          data-cocso-component="segmented-control-indicator"
          style={indicatorStyle}
        />
      )}
      {options.map((option) => (
        <Radio.Root
          className={styles.segment}
          data-cocso-component="segmented-control-item"
          key={option.value}
          value={option.value}
        >
          <span className={styles.label}>{option.label}</span>
          {option.description && (
            <span className={styles.optionDescription}>
              {option.description}
            </span>
          )}
        </Radio.Root>
      ))}
    </RadioGroup>
  );

  if (!description) {
    return control;
  }

  return (
    <div
      className={cn(styles.root, fitContent && styles.rootFit, className)}
      data-cocso-component="segmented-control-root"
    >
      {control}
      <span className={styles.description} id={descriptionId}>
        {description}
      </span>
    </div>
  );
}
