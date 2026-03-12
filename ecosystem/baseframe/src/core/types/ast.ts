/** Raw token data as stored inside a {@link Token} node, keyed by mode name. */
export interface TokenData {
  /**
   * Mode-keyed values for this token.
   * The `default` key is always present; additional keys represent named modes.
   */
  values: {
    default: string | number;
    [mode: string]: string | number;
  };
}

/**
 * An AST node representing a named token collection and its entries.
 * Produced by the YAML loader and consumed by downstream code generators.
 */
export interface Token {
  /** Collection name and token map. */
  data: {
    /** The name of the collection this token belongs to. */
    collection: string;
    /** Map of token name to its {@link TokenData}. */
    tokens: Record<string, TokenData>;
  };
  /** Discriminant tag identifying this node as a token collection payload. */
  kind: "Tokens";
  /** Human-readable metadata for this token group. */
  metadata: {
    /** Unique identifier for this token group. */
    id: string;
    /** Display name. */
    name: string;
    /** Optional description. */
    description: string;
  };
}

/** Describes a single token collection and the modes it supports. */
export interface Collection {
  /** List of mode names available in this collection (e.g. `["light", "dark"]`). */
  modes: string[];
  /** Collection name. */
  name: string;
}

/**
 * An AST node wrapping the full set of token collections for a design system.
 */
export interface Collections {
  /** Ordered list of {@link Collection} definitions. */
  data: Collection[];
  /** Discriminant tag identifying this node as a collections payload. */
  kind: "TokenCollections";
  /** Human-readable metadata for this collections group. */
  metadata: {
    /** Unique identifier for this collections group. */
    id: string;
    /** Display name. */
    name: string;
  };
}

/**
 * A flattened declaration of a single token with its per-mode values,
 * used as the canonical intermediate representation in the {@link Ast}.
 */
export interface TokenDecl {
  /** Identity of the token: its name and owning collection. */
  token: {
    /** Token name within the collection. */
    name: string;
    /** Collection that owns this token. */
    collection: string;
  };
  /** Per-mode value entries for this token. */
  values: {
    /** Mode name (e.g. `"default"`, `"dark"`). */
    mode: string;
    /** Serialized token value for this mode. */
    value: string | number;
  }[];
}

/**
 * A flattened declaration of a collection with the modes it supports,
 * used as the canonical intermediate representation in the {@link Ast}.
 */
export interface CollectionDecl {
  /** Available mode names for this collection. */
  modes: string[];
  /** Collection name. */
  name: string;
}

/**
 * The root AST produced from raw YAML input.
 * Contains all collection declarations and flattened token declarations
 * ready for code generation.
 */
export interface Ast {
  /** All collection declarations extracted from the source. */
  collections: CollectionDecl[];
  /** All token declarations extracted from the source, flattened across collections. */
  tokens: TokenDecl[];
}
