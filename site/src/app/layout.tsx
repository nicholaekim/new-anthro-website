import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";
import { FocusOnNavigate } from "@/components/FocusOnNavigate";
import { NavMenu } from "@/components/NavMenu";
import { RestartButton } from "@/components/RestartButton";
import "./globals.css";

// The four voices. The source voice is provisional until the real sources are seen.
const source = IBM_Plex_Mono({ variable: "--font-source", subsets: ["latin"], weight: ["400", "600"] });
const yours = Source_Serif_4({ variable: "--font-yours", subsets: ["latin"] });
const title = Fraunces({ variable: "--font-title", subsets: ["latin"] });
const iface = Inter({ variable: "--font-interface", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "One Person, Many Boxes",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${source.variable} ${yours.variable} ${title.variable} ${iface.variable} antialiased`}
    >
      <body>
        <a href="#content" className="target sr-only px-2 font-interface focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-40 focus:bg-surround">
          Skip to content
        </a>
        <header className="sticky top-0 z-20 flex items-center gap-2 bg-surround px-2 py-2 text-sm text-paper">
          <NavMenu />
          <RestartButton />
        </header>
        <div id="content" tabIndex={-1}>
          {children}
        </div>
        <Suspense fallback={null}>
          <FocusOnNavigate />
        </Suspense>
      </body>
    </html>
  );
}
