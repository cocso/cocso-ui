"use client";

import { ChevronDownIcon } from "@cocso-ui/react-icons";
import {
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../../cn";
import { Button } from "../button";
import { Typography } from "../typography";
import styles from "./section-header.module.css";

/** The narrowest the title may get before the actions collapse. */
const MIN_TITLE_WIDTH = 120;
/** The gap between the title and the actions — `--cocso-spacing-5`. */
const HEADER_GAP = 8;
/** The least room left between the open panel and the viewport edge. */
const PANEL_MARGIN = 16;
/** The gap between the toggle and the panel under it. */
const PANEL_OFFSET = 4;

/**
 * Floating layers an action may have opened from inside the panel — a menu, a
 * dialog. Interacting with one does not close the panel, and Escape belongs
 * to it first.
 */
const FLOATING_SELECTOR =
  '[role="menu"],[role="dialog"],[role="alertdialog"],[role="listbox"]';

export type SectionHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface SectionHeaderProps
  extends Omit<ComponentProps<"div">, "title"> {
  /**
   * Trailing controls — buttons, a menu, a search box. When the header is too
   * narrow to keep `MIN_TITLE_WIDTH` for the title they collapse behind one
   * toggle button.
   */
  actions?: ReactNode;
  /**
   * Collapses `actions` behind a toggle when they would crowd the title.
   * Defaults to `true`.
   */
  collapsible?: boolean;
  /**
   * Opens the collapsed panel on mount. Only meaningful while collapsed; mostly
   * for showing the panel in documentation.
   */
  defaultActionsOpen?: boolean;
  /** Secondary text under the title. */
  description?: ReactNode;
  /** Heading level of the title. Defaults to `2`. */
  level?: SectionHeaderLevel;
  /** Text of the toggle the actions collapse into. Defaults to `"More"`. */
  moreLabel?: string;
  title: ReactNode;
  /** Class for the title element, e.g. to truncate a long title. */
  titleClassName?: string;
}

interface PanelPosition {
  insetInlineEnd: number;
  maxWidth: number;
  top: number;
}

function measurePanel(toggle: HTMLElement): PanelPosition {
  const rect = toggle.getBoundingClientRect();
  const viewport = document.documentElement.clientWidth;
  const rtl = getComputedStyle(toggle).direction === "rtl";
  return {
    top: rect.bottom + PANEL_OFFSET,
    insetInlineEnd: rtl ? rect.left : viewport - rect.right,
    maxWidth: (rtl ? viewport - rect.left : rect.right) - PANEL_MARGIN,
  };
}

/**
 * The actions slot. When it runs out of room it hands its content to a panel
 * that opens under a toggle.
 *
 * The actions are hidden, never unmounted, while the panel is closed, and the
 * panel is the same element as the inline slot. An action that owns a dialog
 * keeps its state through a collapse, and a dialog opened from the panel
 * survives the panel closing. That is also why this is not built on
 * `Popover`: a portal moves the actions to another tree and remounts them.
 * The panel is a disclosure — the toggle carries `aria-expanded` and
 * `aria-controls` — not a dialog.
 */
function CollapsibleActions({
  actions,
  collapsible,
  defaultOpen,
  moreLabel,
}: {
  actions: ReactNode;
  collapsible: boolean;
  defaultOpen: boolean;
  moreLabel: string;
}) {
  const panelId = useId();
  const actionsRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const [position, setPosition] = useState<PanelPosition | null>(null);

  // Once collapsed the slot no longer has an inline width to measure, so the
  // width it had while expanded is kept.
  const expandedWidthRef = useRef(0);
  const collapsedRef = useRef(false);

  useLayoutEffect(() => {
    const element = actionsRef.current;
    const header = element?.parentElement;
    if (!(collapsible && header && element)) {
      collapsedRef.current = false;
      setCollapsed(false);
      return;
    }

    const measure = () => {
      if (!collapsedRef.current) {
        expandedWidthRef.current = element.offsetWidth;
      }
      const next =
        header.clientWidth <
        expandedWidthRef.current + HEADER_GAP + MIN_TITLE_WIDTH;
      collapsedRef.current = next;
      setCollapsed(next);
      // Widening closes the panel, so narrowing again later does not bring
      // it back by itself.
      if (!next) {
        setOpen(false);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    observer.observe(element);
    return () => observer.disconnect();
  }, [collapsible]);

  const expanded = collapsed && open;

  useLayoutEffect(() => {
    if (expanded && toggleRef.current) {
      setPosition(measurePanel(toggleRef.current));
    } else {
      setPosition(null);
    }
  }, [expanded]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const isInside = (target: EventTarget | null) =>
      target instanceof Element &&
      (Boolean(actionsRef.current?.contains(target)) ||
        Boolean(toggleRef.current?.contains(target)) ||
        Boolean(target.closest(FLOATING_SELECTOR)));
    const close = (event: Event) => {
      if (!isInside(event.target)) {
        setOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !document.querySelector(FLOATING_SELECTOR)
      ) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("scroll", close, true);
    };
  }, [expanded]);

  const style: CSSProperties | undefined =
    expanded && position ? position : undefined;
  let state: "open" | "closed" | undefined;
  if (collapsed) {
    state = open ? "open" : "closed";
  }

  return (
    <>
      {collapsed && (
        <Button
          aria-controls={panelId}
          aria-expanded={open}
          className={styles.toggle}
          onClick={() => setOpen((current) => !current)}
          ref={toggleRef}
          size="x-small"
          suffix={<ChevronDownIcon size={14} />}
          type="button"
          variant="outline"
        >
          {moreLabel}
        </Button>
      )}
      <div
        className={cn(styles.actions, collapsed && styles.panel)}
        data-cocso-component="section-header-actions"
        data-state={state}
        hidden={collapsed && !open}
        id={panelId}
        ref={actionsRef}
        style={style}
      >
        {actions}
      </div>
    </>
  );
}

/**
 * The heading row of a section or a card: a title, its actions on the same
 * line, and an optional description under them.
 *
 * When the row gets too narrow for the actions to sit beside the title, they
 * collapse behind a single toggle and open in a panel under it, so the title
 * is never squeezed to nothing.
 *
 * @example
 * <Card>
 *   <SectionHeader actions={<Button>Add</Button>} title="Medicines" />
 * </Card>
 */
export function SectionHeader({
  className,
  title,
  titleClassName,
  description,
  actions,
  level = 2,
  moreLabel = "More",
  collapsible = true,
  defaultActionsOpen = false,
  ...props
}: SectionHeaderProps) {
  const Heading = `h${level}` as const;

  return (
    <div
      className={cn(styles.root, className)}
      data-cocso-component="section-header"
      {...props}
    >
      <div className={styles.row}>
        <Typography
          className={cn(styles.title, titleClassName)}
          render={<Heading />}
          size="small"
          type="heading"
          weight="bold"
        >
          {title}
        </Typography>
        {actions ? (
          <CollapsibleActions
            actions={actions}
            collapsible={collapsible}
            defaultOpen={defaultActionsOpen}
            moreLabel={moreLabel}
          />
        ) : null}
      </div>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
