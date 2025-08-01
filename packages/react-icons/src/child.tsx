import * as React from 'react';

type ChildProps = {
  children: React.ReactNode;
  [key: string]: unknown;
};

const Child = ({ children, ...props }: ChildProps) => {
  const child: React.ReactNode = React.Children.only(children);

  return React.isValidElement(child) ? React.cloneElement(child, props) : null;
};

export default Child;
