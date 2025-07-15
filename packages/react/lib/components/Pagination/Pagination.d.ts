import * as React from 'react';
export type PaginationProps = {
    asChild?: boolean;
    page: number;
    count: number;
    onChange: (pageNumber: number) => void;
} & React.ComponentPropsWithoutRef<'div'>;
export declare const Pagination: React.ForwardRefExoticComponent<{
    asChild?: boolean;
    page: number;
    count: number;
    onChange: (pageNumber: number) => void;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>> & {
    displayName: string;
};
