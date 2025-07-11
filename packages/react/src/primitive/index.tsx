import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

export interface PrimitiveProps {
  asChild?: boolean;
}

type PropsWithRef<E extends React.ElementType> = React.ComponentPropsWithRef<E> & PrimitiveProps;

function createPrimitive<E extends React.ElementType>(
  element: E,
): React.ForwardRefExoticComponent<PropsWithRef<E>> {
  const Component = React.forwardRef((props: PropsWithRef<React.ElementType>, ref) => {
    const { asChild, ...rest } = props;
    const Comp = asChild ? Slot : element;

    return <Comp {...rest} ref={ref} />;
  });

  Component.displayName = `Primitive.${element}`;

  return Component as React.ForwardRefExoticComponent<PropsWithRef<E>>;
}

const Primitive = {
  div: createPrimitive('div'),
  span: createPrimitive('span'),
  button: createPrimitive('button'),
  input: createPrimitive('input'),
  form: createPrimitive('form'),
  label: createPrimitive('label'),
  p: createPrimitive('p'),
  h1: createPrimitive('h1'),
  h2: createPrimitive('h2'),
  h3: createPrimitive('h3'),
  h4: createPrimitive('h4'),
  h5: createPrimitive('h5'),
  h6: createPrimitive('h6'),
  section: createPrimitive('section'),
  article: createPrimitive('article'),
  header: createPrimitive('header'),
  footer: createPrimitive('footer'),
  main: createPrimitive('main'),
  nav: createPrimitive('nav'),
  aside: createPrimitive('aside'),
  ul: createPrimitive('ul'),
  ol: createPrimitive('ol'),
  li: createPrimitive('li'),
  img: createPrimitive('img'),
  a: createPrimitive('a'),
  strong: createPrimitive('strong'),
  em: createPrimitive('em'),
  small: createPrimitive('small'),
  table: createPrimitive('table'),
  thead: createPrimitive('thead'),
  tbody: createPrimitive('tbody'),
  tr: createPrimitive('tr'),
  td: createPrimitive('td'),
  th: createPrimitive('th'),
};

export { createPrimitive, Primitive };
export type { PropsWithRef };
