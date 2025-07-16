import * as React from 'react';
export type QuantityStatus = '보통' | '여유' | '부족';
export type QuantityStatusProps = {
    quantity: QuantityStatus;
} & React.ComponentPropsWithoutRef<'div'>;
export declare const StockQuantityStatus: React.ForwardRefExoticComponent<{
    quantity: QuantityStatus;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>> & {
    displayName: string;
};
