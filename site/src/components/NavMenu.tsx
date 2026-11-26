import Link from "next/link";
import { chapters } from "@/content";

const LINKS = [
  { href: "/", label: "Opening" },
  ...chapters.map((c) => ({ href: `/chapters/${c.slug}`, label: `${c.place}, ${c.historicalYear} and ${c.presentYear}` })),
  { href: "/ending", label: "Ending" },
];

// A native disclosure: the links are in the HTML and work without scripts.
export function NavMenu() {
  return (
    <details data-nav-menu className="relative">
      <summary className="target px-2 font-interface">Menu</summary>
      <nav aria-label="Site" className="absolute left-0 top-full z-30 mt-1 min-w-64 bg-surround p-2 shadow-lg outline outline-interface">
        <ol className="flex flex-col">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="target w-full px-2 underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
