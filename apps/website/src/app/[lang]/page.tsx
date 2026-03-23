import { notFound, redirect } from "next/navigation";
import { i18n } from "~/libs/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

const Page = async ({ params }: Props) => {
  const { lang } = await params;

  if (!(i18n.languages as readonly string[]).includes(lang)) {
    notFound();
  }

  redirect(`/${lang === "en" ? "" : `${lang}/`}introduction`);
};

export default Page;
