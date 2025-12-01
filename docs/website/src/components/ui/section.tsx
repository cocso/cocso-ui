import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface SectionRootProps extends ComponentProps<'section'> {}

const SectionRoot = ({ className, ...props }: SectionRootProps) => {
  return (
    <section
      className={twMerge(
        '-m-px flex flex-col gap-4 border border-neutral-200 p-app lg:p-8',
        className,
      )}
      {...props}
    />
  );
};

interface SectionTitleProps extends ComponentProps<'h2'> {}

const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
  return <h2 className={twMerge('mb-2 font-semibold text-xl', className)} {...props} />;
};

interface SectionTextProps extends ComponentProps<'p'> {}

const SectionText = ({ className, ...props }: SectionTextProps) => {
  return <p className={twMerge('text-neutral-700 leading-relaxed', className)} {...props} />;
};

export const Section = Object.assign(SectionRoot, {
  Title: SectionTitle,
  Text: SectionText,
});
