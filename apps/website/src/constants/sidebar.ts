interface SidebarItem {
  readonly name: string;
  readonly type: "page";
  readonly url: string;
}

interface SidebarSection {
  readonly items: readonly SidebarItem[];
  readonly title: string;
}

type Sidebar = Record<string, SidebarSection>;

const componentItems: readonly SidebarItem[] = [
  { type: "page", name: "Accordion", url: "/components/accordion" },
  { type: "page", name: "Badge", url: "/components/badge" },
  { type: "page", name: "Button", url: "/components/button" },
  { type: "page", name: "Checkbox", url: "/components/checkbox" },
  { type: "page", name: "Day Picker", url: "/components/day-picker" },
  { type: "page", name: "Dialog", url: "/components/dialog" },
  { type: "page", name: "Dropdown", url: "/components/dropdown" },
  { type: "page", name: "Field", url: "/components/field" },
  { type: "page", name: "Input", url: "/components/input" },
  { type: "page", name: "Link", url: "/components/link" },
  { type: "page", name: "Month Picker", url: "/components/month-picker" },
  {
    type: "page",
    name: "OTP Field",
    url: "/components/one-time-password-field",
  },
  { type: "page", name: "Pagination", url: "/components/pagination" },
  { type: "page", name: "Popover", url: "/components/popover" },
  { type: "page", name: "Radio Group", url: "/components/radio-group" },
  { type: "page", name: "Select", url: "/components/select" },
  { type: "page", name: "Spinner", url: "/components/spinner" },
  {
    type: "page",
    name: "Stock Status",
    url: "/components/stock-quantity-status",
  },
  { type: "page", name: "Switch", url: "/components/switch" },
  { type: "page", name: "Tab", url: "/components/tab" },
  { type: "page", name: "Toast", url: "/components/toast" },
  { type: "page", name: "Tooltip", url: "/components/tooltip" },
  { type: "page", name: "Typography", url: "/components/typography" },
];

const en: Sidebar = {
  "getting-started": {
    title: "Getting Started",
    items: [
      {
        type: "page",
        name: "Introduction",
        url: "/getting-started/introduction",
      },
      {
        type: "page",
        name: "Installation",
        url: "/getting-started/installation",
      },
      {
        type: "page",
        name: "MCP Connection",
        url: "/getting-started/mcp-connection",
      },
    ],
  },
  foundations: {
    title: "Foundations",
    items: [
      { type: "page", name: "Colors", url: "/foundations/colors" },
      { type: "page", name: "Typography", url: "/foundations/typography" },
      { type: "page", name: "Icons", url: "/foundations/icons" },
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
      { type: "page", name: "소개", url: "/getting-started/introduction" },
      { type: "page", name: "설치", url: "/getting-started/installation" },
      {
        type: "page",
        name: "MCP 연결",
        url: "/getting-started/mcp-connection",
      },
    ],
  },
  foundations: {
    title: "Foundations",
    items: [
      { type: "page", name: "Colors", url: "/foundations/colors" },
      { type: "page", name: "Typography", url: "/foundations/typography" },
      { type: "page", name: "Icons", url: "/foundations/icons" },
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
