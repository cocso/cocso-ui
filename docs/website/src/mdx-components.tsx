import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';
import * as tabsComponents from 'fumadocs-ui/components/tabs';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Section } from '~/components/ui';

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,

    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    CodeBlock,

    Section,

    ...tabsComponents,
    ...components,
  };
}
