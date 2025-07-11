import * as React from 'react';
type BodyElement = 'p' | 'span' | 'div' | 'label' | 'li' | 'td' | 'th' | 'figcaption' | 'blockquote' | 'cite';
export interface BodyProps<T extends React.ElementType = 'p'> {
    as?: T & BodyElement;
    size?: 'lg' | 'md' | 'sm' | 'xs';
    color?: string;
    fontWeight?: 'normal' | 'bold';
}
export type BodyPropsWithElement<T extends React.ElementType = 'p'> = BodyProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof BodyProps<T>>;
export declare const Body: React.ForwardRefExoticComponent<BodyProps<BodyElement> & Omit<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>, "ref"> | Omit<React.DetailedHTMLProps<React.BlockquoteHTMLAttributes<HTMLQuoteElement>, HTMLQuoteElement>, "ref"> | Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> | Omit<React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>, "ref"> | Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> | Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, "ref"> | Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>, "ref"> | Omit<React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>, "ref"> | Omit<React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableHeaderCellElement>, HTMLTableHeaderCellElement>, "ref">, keyof BodyProps<T>> & React.RefAttributes<HTMLElement>>;
export {};
