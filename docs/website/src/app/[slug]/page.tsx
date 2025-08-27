import { colors, Heading, Typography } from '@cocso-ui/react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Section } from '~/components/ui';
import { source } from '~/libs/source';
import { getMDXComponents } from '~/mdx-components';

type Props = {
  params: Promise<{ slug: string }>;
};

const Page = async ({ params }: Props) => {
  const { slug } = await params;
  const page = source.getPage([slug]);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <>
      <Section>
        <Heading size="lg">{page.data.title}</Heading>
        <Typography className="mt-1" color={colors.neutral500} weight="medium">
          {page.data.description}
        </Typography>
      </Section>

      <MDX components={getMDXComponents()} />
    </>
  );
};

export default Page;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const { slug } = await params;
  const page = source.getPage([slug]);

  if (!page) {
    notFound();
  }

  return {
    title: page.data.title,
    description: page.data.description,
  };
};
