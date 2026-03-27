export interface RegistryIcon {
  aliases: string[];
  category: string;
  colorStrategy: string;
  componentName: string;
  name: string;
  source: string;
  tags: string[];
  useStaticIds?: boolean;
  viewBox: string;
}

export interface Registry {
  icons: RegistryIcon[];
}

export function pascalToKebab(str: string): string {
  return str
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();
}
