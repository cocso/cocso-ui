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

interface SectionTextProps extends ComponentProps<'div'> {}

const SectionText = ({ className, ...props }: SectionTextProps) => {
  return <div className={twMerge('text-neutral-800 leading-relaxed', className)} {...props} />;
};

interface SectionUnorderedListProps extends ComponentProps<'ul'> {}

const SectionUnorderedList = ({ className, ...props }: SectionUnorderedListProps) => {
  return (
    <ul
      className={twMerge(
        'flex list-outside list-disc flex-col gap-2 pl-5 marker:text-neutral-400',
        className,
      )}
      {...props}
    />
  );
};

interface SectionOrderedListProps extends ComponentProps<'ol'> {}

const SectionOrderedList = ({ className, ...props }: SectionOrderedListProps) => {
  return (
    <ol
      className={twMerge(
        'flex list-outside list-decimal flex-col gap-2 pl-5 marker:font-sans marker:text-neutral-400',
        className,
      )}
      {...props}
    />
  );
};

interface SectionListItemProps extends ComponentProps<'li'> {}

const SectionListItem = ({ className, ...props }: SectionListItemProps) => {
  return (
    <li
      className={twMerge('pl-1 font-normal text-md text-neutral-800 leading-relaxed', className)}
      {...props}
    />
  );
};

export const Section = Object.assign(SectionRoot, {
  Title: SectionTitle,
  Text: SectionText,
  UnorderedList: SectionUnorderedList,
  OrderedList: SectionOrderedList,
  ListItem: SectionListItem,
});
