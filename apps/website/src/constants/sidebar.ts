interface SidebarItem {
  readonly type: "page";
  readonly name: string;
  readonly url: string;
}

interface SidebarSection {
  readonly title: string;
  readonly items: readonly SidebarItem[];
}

type Sidebar = Record<string, SidebarSection>;

const componentItems: readonly SidebarItem[] = [
  { type: "page", name: "Accordion", url: "/accordion" },
  { type: "page", name: "Badge", url: "/badge" },
  { type: "page", name: "Button", url: "/button" },
  { type: "page", name: "Checkbox", url: "/checkbox" },
  { type: "page", name: "Day Picker", url: "/day-picker" },
  { type: "page", name: "Dialog", url: "/dialog" },
  { type: "page", name: "Dropdown", url: "/dropdown" },
  { type: "page", name: "Field", url: "/field" },
  { type: "page", name: "Input", url: "/input" },
  { type: "page", name: "Link", url: "/link" },
  { type: "page", name: "Month Picker", url: "/month-picker" },
  { type: "page", name: "OTP Field", url: "/one-time-password-field" },
  { type: "page", name: "Pagination", url: "/pagination" },
  { type: "page", name: "Popover", url: "/popover" },
  { type: "page", name: "Radio Group", url: "/radio-group" },
  { type: "page", name: "Select", url: "/select" },
  { type: "page", name: "Spinner", url: "/spinner" },
  { type: "page", name: "Stock Status", url: "/stock-quantity-status" },
  { type: "page", name: "Switch", url: "/switch" },
  { type: "page", name: "Tab", url: "/tab" },
  { type: "page", name: "Toast", url: "/toast" },
  { type: "page", name: "Tooltip", url: "/tooltip" },
  { type: "page", name: "Typography", url: "/typography-component" },
];

const en: Sidebar = {
  "getting-started": {
    title: "Getting Started",
    items: [
      { type: "page", name: "Introduction", url: "/introduction" },
      { type: "page", name: "Installation", url: "/installation" },
    ],
  },
  foundations: {
    title: "Foundations",
    items: [
      { type: "page", name: "Colors", url: "/colors" },
      { type: "page", name: "Typography", url: "/typography" },
      { type: "page", name: "Icons", url: "/icons" },
    ],
  },
  components: {
    title: "Components",
    items: componentItems,
  },
};

const ko: Sidebar = {
  "getting-started": {
    title: "Getting Started",
    items: [
      { type: "page", name: "소개", url: "/introduction" },
      { type: "page", name: "설치", url: "/installation" },
    ],
  },
  foundations: {
    title: "Foundations",
    items: [
      { type: "page", name: "Colors", url: "/colors" },
      { type: "page", name: "Typography", url: "/typography" },
      { type: "page", name: "Icons", url: "/icons" },
    ],
  },
  components: {
    title: "Components",
    items: componentItems,
  },
};

const sidebars: Record<string, Sidebar> = { en, ko };

export const getSidebarForLocale = (locale: string): Sidebar =>
  sidebars[locale] ?? en;

export const sidebar = en;
