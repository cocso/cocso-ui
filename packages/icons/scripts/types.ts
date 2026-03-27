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
