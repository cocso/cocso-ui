export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ').trim();
};

const createVariantClass = (baseClass: string, key: string, value: any): string => {
  return `${baseClass}--${key}_${value}`;
};

const createVariantClasses = (baseClass: string, variants: Record<string, any>): string => {
  return Object.entries(variants)
    .map(([key, value]) => createVariantClass(baseClass, key, value))
    .join(' ');
};

const matchesCompoundVariant = (
  compoundVariant: Record<string, any>,
  variants: Record<string, any>,
): boolean => {
  return Object.entries(compoundVariant).every(([key, value]) => variants[key] === value);
};

const createCompoundVariantClass = (
  baseClass: string,
  compoundVariant: Record<string, any>,
): string => {
  const conditions = Object.entries(compoundVariant)
    .map(([key, value]) => `${key}_${value}`)
    .join('-');

  return `${baseClass}--${conditions}`;
};

const createCompoundVariantClasses = (
  baseClass: string,
  variants: Record<string, any>,
  compoundVariants: Record<string, any>[],
): string => {
  return compoundVariants
    .filter((compoundVariant) => matchesCompoundVariant(compoundVariant, variants))
    .map((compoundVariant) => createCompoundVariantClass(baseClass, compoundVariant))
    .join(' ');
};

export const createClassName = (
  baseClass: string,
  variants: Record<string, any>,
  compoundVariants: Record<string, any>[] = [],
  ...additionalClasses: (string | undefined | null | false)[]
): string => {
  const base = baseClass;
  const variantClasses = createVariantClasses(baseClass, variants);
  const compoundClasses = createCompoundVariantClasses(baseClass, variants, compoundVariants);

  return cn(base, variantClasses, compoundClasses, ...additionalClasses);
};
