/** Supported platform identifiers for component usage context. */
export const PlatformId = {
  REACT: "react",
  REACT_NATIVE: "react-native",
} as const;

/** Union of valid platform identifier strings. */
export type PlatformId = (typeof PlatformId)[keyof typeof PlatformId];

/** Available documentation section identifiers. */
export const DocumentationSectionId = {
  GETTING_STARTED: "getting-started",
  FOUNDATIONS: "foundations",
  COMPONENTS: "components",
} as const;

/** Union of valid documentation section identifier strings. */
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
