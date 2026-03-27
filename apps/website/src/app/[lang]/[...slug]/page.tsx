import { colors, Typography } from "@cocso-ui/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Section } from "~/components/ui/section";
import { i18n, type Locale } from "~/libs/i18n";
import { source } from "~/libs/source";
import { getMDXComponents } from "~/mdx-components";

interface Props {
  params: Promise<{ lang: Locale; slug: string[] }>;
}

const isValidLocale = (lang: string): lang is Locale =>
  (i18n.languages as readonly string[]).includes(lang);

const Page = async ({ params }: Props) => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const page = source.getPage(slug, lang) ?? source.getPage(slug, "en");

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <>
      <Section>
        <Typography size="large" type="heading" weight="semibold">
          {page.data.title}
        </Typography>
        <Typography
          className="mt-1"
          color={colors.textSecondary}
          weight="medium"
        >
          {page.data.description}
        </Typography>
      </Section>

      <MDX components={getMDXComponents()} />
    </>
  );
};

export default Page;

export const generateStaticParams = () =>
  source.getLanguages().flatMap(({ language, pages }) =>
    pages.map((page) => {
      const slugs = page.slugs.map((s) => s);

      return {
        lang: language,
        slug: slugs[0] === language ? slugs.slice(1) : slugs,
      };
    })
  );

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { lang, slug } = await params;

  if (!isValidLocale(lang)) {
    notFound();
  }

  const page = source.getPage(slug, lang) ?? source.getPage(slug, "en");

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
};
