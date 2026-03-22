import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ lang: string }>;
}

const Page = async ({ params }: Props) => {
  const { lang } = await params;
  redirect(`/${lang === "en" ? "" : `${lang}/`}introduction`);
};

export default Page;
