import * as React from 'react';
export type PaginationProps = {
    page: number;
    totalPages: number;
    maxVisible?: number;
    onChange: (pageNumber: number) => void;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'>;
export declare const Pagination: React.ForwardRefExoticComponent<{
    page: number;
    totalPages: number;
    maxVisible?: number;
    onChange: (pageNumber: number) => void;
} & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref">, "onChange"> & React.RefAttributes<HTMLDivElement>> & {
    displayName: string;
};
