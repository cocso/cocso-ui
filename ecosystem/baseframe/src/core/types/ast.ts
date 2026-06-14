export interface TokenData {
  values: {
    default: string | number;
    [mode: string]: string | number;
  };
}

export interface Token {
  data: {
    collection: string;
    tokens: Record<string, TokenData>;
  };
  kind: "Tokens";
  metadata: {
    id: string;
    name: string;
    description: string;
  };
}

export interface Collection {
  modes: string[];
  name: string;
}

export interface Collections {
  data: Collection[];
  kind: "TokenCollections";
  metadata: {
    id: string;
    name: string;
  };
}

export interface TokenDecl {
  token: {
    name: string;
    collection: string;
  };
  values: {
    mode: string;
    value: string | number;
  }[];
}

export interface CollectionDecl {
  modes: string[];
  name: string;
}

export interface Ast {
  collections: CollectionDecl[];
  tokens: TokenDecl[];
}
