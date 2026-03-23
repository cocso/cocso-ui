import { Link } from "@cocso-ui/react";
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
import NextLink from "next/link";
import { ColorScale } from "~/components/ui/color-palette";
import { ComponentExample } from "~/components/ui/component-example";
import { PageNavigation } from "~/components/ui/page-navigation";
import { PropsTable } from "~/components/ui/props-table";
import { Section } from "~/components/ui/section";
import { TokenTable } from "~/components/ui/token-table";

const LinkExternalIcon = Link.ExternalIcon;

const SubHeading = (props: React.ComponentProps<"h4">) => (
  <h4
    className="mt-8 mb-2 font-semibold text-[15px] first-of-type:mt-0"
    {...props}
  />
);

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,

    pre: ({ ref: _ref, ...props }) => (
      <CodeBlock {...props}>
        <Pre>{props.children}</Pre>
      </CodeBlock>
    ),
    CodeBlock,

    Link,
    LinkExternalIcon,
    NextLink,
    Section,
    ComponentExample,
    PageNavigation,
    PropsTable,
    ColorScale,
    TokenTable,
    SubHeading,

    Tab,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    ...components,
  };
}
