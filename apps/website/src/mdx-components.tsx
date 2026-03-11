import { CodeBlock, Pre } from "fumadocs-ui/components/codeblock";
import {
  Tab,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "fumadocs-ui/components/tabs";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { ComponentExample } from "~/components/ui/component-example";
import { PageNavigation } from "~/components/ui/page-navigation";
import { Section } from "~/components/ui/section";

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
    ComponentExample,
    PageNavigation,

    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
  };
}
