export interface TokenData {
  values: {
    default: string | number;
    [mode: string]: string | number;
  };
}

export interface Token {
  kind: 'Tokens';
  metadata: {
    id: string;
    name: string;
    description: string;
  };
  data: {
    collection: string;
    tokens: Record<string, TokenData>;
  };
}

export interface Collection {
  name: string;
  modes: string[];
}

export interface Collections {
  kind: 'TokenCollections';
  metadata: {
    id: string;
    name: string;
  };
  data: Collection[];
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
  name: string;
  modes: string[];
}

export interface Ast {
  tokens: TokenDecl[];
  collections: CollectionDecl[];
}
