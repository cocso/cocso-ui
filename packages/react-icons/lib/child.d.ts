import * as React from 'react';
type ChildProps = {
    children: React.ReactNode;
    [key: string]: unknown;
};
declare const Child: ({ children, ...props }: ChildProps) => React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | null;
export default Child;
