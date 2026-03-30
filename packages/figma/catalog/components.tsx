/**
 * Component catalog: renders every @cocso-ui/react component variant
 * so the extraction script can capture computed styles from the real DOM.
 *
 * Each renderable element is wrapped in a `div[data-component][data-variant-key]`
 * to allow programmatic identification during extraction.
 *
 * NOTE: Compound/portal-based components (Dialog, Tooltip, Popover, Dropdown)
 * are rendered as static HTML approximations since they need user interaction
 * or portal roots that don't exist in this headless context.
 */

import {
  Accordion,
  Badge,
  Button,
  Checkbox,
  type CheckboxStatus,
  DayPicker,
  Field,
  Input,
  Link,
  MonthPicker,
  OneTimePasswordField,
  Pagination,
  RadioGroup,
  Select,
  Spinner,
  StockQuantityStatus,
  Switch,
  Tab,
  Typography,
} from "@cocso-ui/react";
import { Component, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------------
// Error boundary to prevent one broken component from crashing the whole page
// ---------------------------------------------------------------------------

class ErrorBoundary extends Component<
  { children: ReactNode; name: string },
  { error: string | null }
> {
  state = { error: null as string | null };
  static getDerivedStateFromError(e: Error) {
    return { error: e.message };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: "red", fontSize: 12, padding: 4 }}>
          {this.props.name}: {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Item({
  component,
  variantKey,
  children,
}: {
  component: string;
  variantKey: string;
  children: ReactNode;
}) {
  return (
    <div
      data-component={component}
      data-variant-key={variantKey}
      style={{ display: "inline-block", padding: 8 }}
    >
      <ErrorBoundary name={`${component}/${variantKey}`}>
        {children}
      </ErrorBoundary>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily: "Pretendard Variable, Pretendard, sans-serif", marginBottom: 8 }}>
        {title}
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {children}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BUTTON_VARIANTS = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "success",
  "error",
  "warning",
  "info",
] as const;
const BUTTON_SIZES = ["large", "medium", "small", "x-small"] as const;

const BADGE_VARIANTS = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "outline",
] as const;
const BADGE_SIZES = ["large", "medium", "small"] as const;

const SPINNER_VARIANTS = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "white",
] as const;
const SPINNER_SIZES = ["large", "medium", "small"] as const;

const SWITCH_VARIANTS = [
  "primary",
  "success",
  "error",
  "warning",
  "info",
] as const;
const SIZES_3 = ["large", "medium", "small"] as const;

const LINK_VARIANTS = ["inline", "current", "plain"] as const;
const LINK_SIZE_MAP = {
  large: 18 as const,
  medium: 16 as const,
  small: 14 as const,
  "x-small": 12 as const,
};

const INPUT_SIZES = ["large", "medium", "small", "x-small"] as const;
const CHECKBOX_STATUSES: CheckboxStatus[] = ["off", "on", "intermediate"];

// ---------------------------------------------------------------------------
// Catalog
// ---------------------------------------------------------------------------

export function ComponentCatalog() {
  return (
    <div
      id="catalog"
      style={{
        padding: 24,
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
        background: "#fff",
      }}
    >
      {/* Typography */}
      <Section title="Typography">
        {[
          { type: "heading" as const, size: "x-large" as const },
          { type: "heading" as const, size: "large" as const },
          { type: "heading" as const, size: "medium" as const },
          { type: "heading" as const, size: "small" as const },
          { type: "heading" as const, size: "x-small" as const },
        ].map(({ type, size }) => (
          <Item
            component="Typography"
            key={`${type}-${size}`}
            variantKey={`type=${type},size=${size}`}
          >
            <Typography size={size} type={type}>
              Heading {size}
            </Typography>
          </Item>
        ))}
        {(["large", "medium", "small", "x-small"] as const).map((size) =>
          (["normal", "medium", "semibold", "bold"] as const).map((weight) => (
            <Item
              component="Typography"
              key={`body-${size}-${weight}`}
              variantKey={`type=body,size=${size},weight=${weight}`}
            >
              <Typography size={size} type="body" weight={weight}>
                {`${weight} (${weight === "normal" ? 400 : weight === "medium" ? 500 : weight === "semibold" ? 600 : 700})`}
              </Typography>
            </Item>
          ))
        )}
      </Section>

      {/* Button */}
      <Section title="Button">
        {BUTTON_VARIANTS.map((variant) =>
          BUTTON_SIZES.map((size) => (
            <Item
              component="Button"
              key={`${variant}-${size}`}
              variantKey={`variant=${variant},size=${size}`}
            >
              <Button size={size} variant={variant}>
                Button
              </Button>
            </Item>
          ))
        )}
      </Section>

      {/* Badge */}
      <Section title="Badge">
        {BADGE_VARIANTS.map((variant) =>
          BADGE_SIZES.map((size) => (
            <Item
              component="Badge"
              key={`${variant}-${size}`}
              variantKey={`variant=${variant},size=${size}`}
            >
              <Badge size={size} variant={variant}>
                Badge
              </Badge>
            </Item>
          ))
        )}
      </Section>

      {/* Input */}
      <Section title="Input">
        {INPUT_SIZES.map((size) => (
          <Item
            component="Input"
            key={`default-${size}`}
            variantKey={`state=default,size=${size}`}
          >
            <Input placeholder="Placeholder" size={size} />
          </Item>
        ))}
        {INPUT_SIZES.map((size) => (
          <Item
            component="Input"
            key={`error-${size}`}
            variantKey={`state=error,size=${size}`}
          >
            <Input error placeholder="Placeholder" size={size} />
          </Item>
        ))}
      </Section>

      {/* Select */}
      <Section title="Select">
        {INPUT_SIZES.map((size) => (
          <Item component="Select" key={size} variantKey={`size=${size}`}>
            <Select size={size}>
              <option>Select option</option>
            </Select>
          </Item>
        ))}
      </Section>

      {/* Field */}
      <Section title="Field">
        <Item component="Field" variantKey="state=default">
          <Field description="Helper text" label="Label">
            <Input placeholder="Placeholder" />
          </Field>
        </Item>
        <Item component="Field" variantKey="state=error">
          <Field error="Error message" label="Label">
            <Input error placeholder="Placeholder" />
          </Field>
        </Item>
      </Section>

      {/* Checkbox */}
      <Section title="Checkbox">
        {CHECKBOX_STATUSES.map((status) =>
          SIZES_3.map((size) => (
            <Item
              component="Checkbox"
              key={`${status}-${size}`}
              variantKey={`status=${status},size=${size}`}
            >
              <Checkbox label="Label" size={size} status={status} />
            </Item>
          ))
        )}
      </Section>

      {/* Switch */}
      <Section title="Switch">
        {SWITCH_VARIANTS.flatMap((variant) =>
          SIZES_3.flatMap((size) => [
            <Item
              component="Switch"
              key={`${variant}-off-${size}`}
              variantKey={`variant=${variant},checked=false,size=${size}`}
            >
              <Switch label="Label" size={size} variant={variant} />
            </Item>,
            <Item
              component="Switch"
              key={`${variant}-on-${size}`}
              variantKey={`variant=${variant},checked=true,size=${size}`}
            >
              <Switch checked label="Label" size={size} variant={variant} />
            </Item>,
          ])
        )}
      </Section>

      {/* Spinner */}
      <Section title="Spinner">
        {SPINNER_VARIANTS.map((variant) =>
          SPINNER_SIZES.map((size) => (
            <Item
              component="Spinner"
              key={`${variant}-${size}`}
              variantKey={`variant=${variant},size=${size}`}
            >
              <div
                style={
                  variant === "white"
                    ? { background: "#1e2124", padding: 4, borderRadius: 4 }
                    : undefined
                }
              >
                <Spinner size={size} variant={variant} />
              </div>
            </Item>
          ))
        )}
      </Section>

      {/* Link */}
      <Section title="Link">
        {LINK_VARIANTS.map((variant) =>
          (Object.entries(LINK_SIZE_MAP) as [string, 12 | 14 | 16 | 18][]).map(
            ([name, fs]) => (
              <Item
                component="Link"
                key={`${variant}-${name}`}
                variantKey={`variant=${variant},size=${name}`}
              >
                <Link href="#" size={fs} variant={variant}>
                  Link text
                </Link>
              </Item>
            )
          )
        )}
      </Section>

      {/* Accordion */}
      <Section title="Accordion">
        <Item component="Accordion" variantKey="state=collapsed">
          <Accordion.Root>
            <Accordion.Item value="1">
              <Accordion.Header>
                <Accordion.Trigger>Accordion Item</Accordion.Trigger>
              </Accordion.Header>
            </Accordion.Item>
          </Accordion.Root>
        </Item>
        <Item component="Accordion" variantKey="state=expanded">
          <Accordion.Root defaultValue={["1"]}>
            <Accordion.Item value="1">
              <Accordion.Header>
                <Accordion.Trigger>Accordion Item</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                Accordion content goes here.
              </Accordion.Content>
            </Accordion.Item>
          </Accordion.Root>
        </Item>
      </Section>

      {/* Tab */}
      <Section title="Tab">
        <Item component="Tab" variantKey="variant=default">
          <Tab.List defaultValue="1">
            <Tab.Trigger value="1">Tab 1</Tab.Trigger>
            <Tab.Trigger value="2">Tab 2</Tab.Trigger>
            <Tab.Trigger value="3">Tab 3</Tab.Trigger>
          </Tab.List>
        </Item>
      </Section>

      {/* Pagination */}
      <Section title="Pagination">
        <Item component="Pagination" variantKey="variant=default">
          <PaginationExample />
        </Item>
      </Section>

      {/* OTP Field */}
      <Section title="OTPField">
        <Item component="OTPField" variantKey="filled=0">
          <OneTimePasswordField />
        </Item>
      </Section>

      {/* Radio */}
      <Section title="Radio">
        {SIZES_3.map((size) => (
          <Item
            component="Radio"
            key={`selected-${size}`}
            variantKey={`selected=true,size=${size}`}
          >
            <RadioGroup.Root defaultValue="a">
              <RadioGroup.Item size={size} value="a">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </RadioGroup.Root>
          </Item>
        ))}
        {SIZES_3.map((size) => (
          <Item
            component="Radio"
            key={`unselected-${size}`}
            variantKey={`selected=false,size=${size}`}
          >
            <RadioGroup.Root>
              <RadioGroup.Item size={size} value="a">
                <RadioGroup.Indicator />
              </RadioGroup.Item>
            </RadioGroup.Root>
          </Item>
        ))}
      </Section>

      {/* DayPicker */}
      <Section title="DayPicker">
        <Item component="DayPicker" variantKey="variant=default">
          <DayPickerExample />
        </Item>
      </Section>

      {/* MonthPicker */}
      <Section title="MonthPicker">
        <Item component="MonthPicker" variantKey="variant=default">
          <MonthPickerExample />
        </Item>
      </Section>

      {/* StockQuantityStatus */}
      <Section title="StockQuantityStatus">
        {(["sufficient", "normal", "insufficient"] as const).map((quantity) => (
          <Item
            component="StockQuantityStatus"
            key={quantity}
            variantKey={`quantity=${quantity}`}
          >
            <StockQuantityStatus quantity={quantity} />
          </Item>
        ))}
      </Section>

      {/* --- Static representations for portal/interactive components --- */}

      {/* Dialog (static - portal-based, can't render inline) */}
      <Section title="Dialog">
        {(["small", "medium", "large"] as const).map((size) => (
          <Item component="Dialog" key={size} variantKey={`size=${size}`}>
            <StaticDialog size={size} />
          </Item>
        ))}
      </Section>

      {/* Tooltip (static) */}
      <Section title="Tooltip">
        <Item component="Tooltip" variantKey="variant=default">
          <StaticTooltip />
        </Item>
      </Section>

      {/* Popover (static) */}
      <Section title="Popover">
        <Item component="Popover" variantKey="variant=default">
          <StaticPopover />
        </Item>
      </Section>

      {/* Dropdown (static) */}
      <Section title="Dropdown">
        <Item component="Dropdown" variantKey="variant=default">
          <StaticDropdown />
        </Item>
      </Section>

      {/* Toast (static) */}
      <Section title="Toast">
        {(["default", "success", "error", "warning", "info"] as const).map(
          (variant) => (
            <Item
              component="Toast"
              key={variant}
              variantKey={`variant=${variant}`}
            >
              <StaticToast variant={variant} />
            </Item>
          )
        )}
      </Section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stateful helpers
// ---------------------------------------------------------------------------

function PaginationExample() {
  const [page, setPage] = useState(5);
  return <Pagination onChange={setPage} page={page} totalPages={10} />;
}

function DayPickerExample() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 2, 15));
  return <DayPicker onChange={setDate} value={date} />;
}

function MonthPickerExample() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 2, 1));
  return <MonthPicker onChange={setDate} value={date} />;
}

// ---------------------------------------------------------------------------
// Static approximations for portal/overlay components
// ---------------------------------------------------------------------------

function StaticDialog({ size }: { size: "small" | "medium" | "large" }) {
  const widths = { small: 380, medium: 520, large: 680 };
  return (
    <div
      style={{
        width: widths[size],
        padding: "24px 28px",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 16px 70px rgba(0,0,0,0.2)",
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#1a1d21" }}>
            Dialog Title
          </div>
          <div style={{ fontSize: 14, color: "#6d7882", marginTop: 4 }}>
            This is a description for the dialog content.
          </div>
        </div>
        <div style={{ fontSize: 18, color: "#6d7882", cursor: "pointer" }}>
          ×
        </div>
      </div>
    </div>
  );
}

function StaticTooltip() {
  return (
    <div
      style={{
        padding: "4px 8px",
        background: "#2c3036",
        borderRadius: 4,
        color: "#fff",
        fontSize: 12,
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
      }}
    >
      Tooltip text
    </div>
  );
}

function StaticPopover() {
  return (
    <div
      style={{
        padding: "8px 12px",
        border: "1px solid #e6e8ea",
        borderRadius: 8,
        background: "#fff",
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
        fontSize: 14,
      }}
    >
      Popover content
    </div>
  );
}

function StaticDropdown() {
  return (
    <div
      style={{
        padding: "4px 0",
        border: "1px solid #e6e8ea",
        borderRadius: 8,
        background: "#fff",
        minWidth: 128,
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
        fontSize: 14,
      }}
    >
      <div style={{ padding: "6px 12px" }}>Menu Item 1</div>
      <div style={{ padding: "6px 12px", background: "#f4f5f6" }}>
        Menu Item 2
      </div>
      <div style={{ padding: "6px 12px" }}>Menu Item 3</div>
      <div style={{ padding: "6px 12px", opacity: 0.4 }}>Disabled Item</div>
    </div>
  );
}

function StaticToast({ variant }: { variant: string }) {
  const TOAST_COLORS: Record<
    string,
    { bg: string; border: string; text: string }
  > = {
    default: { bg: "#fff", border: "#e6e8ea", text: "#1a1d21" },
    success: { bg: "#f0fdf4", border: "#16a34a", text: "#16a34a" },
    error: { bg: "#fef2f2", border: "#dc2626", text: "#dc2626" },
    warning: { bg: "#fffbeb", border: "#d97706", text: "#d97706" },
    info: { bg: "#eff6ff", border: "#2563eb", text: "#2563eb" },
  };
  const c = TOAST_COLORS[variant] ?? TOAST_COLORS.default;
  return (
    <div
      style={{
        padding: "10px 16px",
        border: `1px solid ${c.border}`,
        borderRadius: 8,
        background: c.bg,
        color: c.text,
        fontFamily: "Pretendard Variable, Pretendard, sans-serif",
        fontSize: 14,
        minWidth: 300,
      }}
    >
      Toast message content
    </div>
  );
}
