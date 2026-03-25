export const PlatformId = {
  REACT: "react",
  REACT_NATIVE: "react-native",
} as const;

export type PlatformId = (typeof PlatformId)[keyof typeof PlatformId];

export const DocumentationSectionId = {
  GETTING_STARTED: "getting-started",
  FOUNDATIONS: "foundations",
  COMPONENTS: "components",
} as const;

export type DocumentationSectionId =
  (typeof DocumentationSectionId)[keyof typeof DocumentationSectionId];

export interface DocLink {
  description: string;
  section: DocumentationSectionId;
  title: string;
  url: string;
}

export interface ComponentEntry {
  description: string;
  importPackage: string;
  slug: string;
  title: string;
  url: string;
}

export interface RegistrySnapshot {
  components: ComponentEntry[];
  fetchedAtIso: string;
  links: DocLink[];
}
