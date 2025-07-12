export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ').trim();
};

export const createClassName = (
  baseClass: string,
  variants: Record<string, any>,
  compoundVariants: Record<string, any>[] = [],
  ...additionalClasses: (string | undefined | null | false)[]
): string => {
  const variantClasses = Object.entries(variants)
    .map(([key, value]) => `${baseClass}--${key}_${value}`)
    .join(' ');

  const compoundClasses = compoundVariants
    .filter((compoundVariant) =>
      Object.entries(compoundVariant).every(([key, value]) => variants[key] === value),
    )
    .map((compoundVariant) => {
      const conditions = Object.entries(compoundVariant)
        .map(([key, value]) => `${key}_${value}`)
        .join('-');
      return `${baseClass}--${conditions}`;
    })
    .join(' ');

  return cn(baseClass, variantClasses, compoundClasses, ...additionalClasses);
};
