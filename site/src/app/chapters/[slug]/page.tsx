import { notFound } from "next/navigation";
import { ChapterPage } from "@/components/ChapterPage";
import { chapters, getChapter, person } from "@/content";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export default async function Page({ params }: PageProps<"/chapters/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const following = chapters[chapters.indexOf(chapter) + 1];
  const next = following
    ? { href: `/chapters/${following.slug}`, label: `${following.place}, ${following.historicalYear}` }
    : { href: "/ending", label: "Ending" };

  return <ChapterPage chapter={chapter} person={person} next={next} />;
}
