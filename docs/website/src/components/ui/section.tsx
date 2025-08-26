import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = ComponentProps<'section'>;

export const Section = ({ className, ...props }: Props) => {
  return (
    <section className={twMerge('-m-px border border-neutral-200 p-8', className)} {...props} />
  );
};
