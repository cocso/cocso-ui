import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { source } from '~/lib/source';
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

  return <MDX components={getMDXComponents()} />;
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
