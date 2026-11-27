import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageTitle } from "@/app/title";
import { ChapterPage } from "@/components/ChapterPage";
import { chapterTitleCard, ENDING_CARD } from "@/components/navLinks";
import { chapters, getChapter, person } from "@/content";

export function generateStaticParams() {
  return chapters.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/chapters/[slug]">): Promise<Metadata> {
  const chapter = getChapter((await params).slug);
  if (!chapter) return {};
  return { title: pageTitle(`${chapter.place}, ${chapter.historicalYear} and ${chapter.presentYear}`) };
}

export default async function Page({ params }: PageProps<"/chapters/[slug]">) {
  const { slug } = await params;
  const chapter = getChapter(slug);
  if (!chapter) notFound();

  const index = chapters.indexOf(chapter);
  const following = chapters[index + 1];
  const next = following
    ? {
        href: `/chapters/${following.slug}`,
        label: `${following.place}, ${following.historicalYear}`,
        card: chapterTitleCard(following, index + 2, chapters.length),
      }
    : { href: "/ending", label: "Ending", card: ENDING_CARD };

  const position = { number: index + 1, count: chapters.length };
  return <ChapterPage chapter={chapter} person={person} next={next} position={position} />;
}
