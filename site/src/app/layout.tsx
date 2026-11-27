import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
import { Suspense } from "react";
import { FocusOnNavigate } from "@/components/FocusOnNavigate";
import { MotionSwitch } from "@/components/MotionSwitch";
import { NavMenu } from "@/components/NavMenu";
import { navLinks } from "@/components/navLinks";
import { RestartButton } from "@/components/RestartButton";
import { chapters } from "@/content";
import { CoverProvider } from "@/motion/CoverProvider";
import { MotionProvider } from "@/motion/MotionProvider";
import { MotionReady } from "@/motion/MotionReady";
import { pendingScript } from "@/motion/pending";
import "./globals.css";
import { SITE_NAME } from "./title";

// The four voices. The source voice is provisional until the real sources are seen.
const source = IBM_Plex_Mono({ variable: "--font-source", subsets: ["latin"], weight: ["400", "600"] });
const yours = Source_Serif_4({ variable: "--font-yours", subsets: ["latin"], axes: ["opsz"] });
// The optical-size axis lets the title cut tighten at display sizes.
const title = Fraunces({ variable: "--font-title", subsets: ["latin"], axes: ["opsz"] });
const iface = Inter({ variable: "--font-interface", subsets: ["latin"] });

export const metadata: Metadata = {
  title: SITE_NAME,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${source.variable} ${yours.variable} ${title.variable} ${iface.variable} antialiased`}
      // The inline script below may add data-motion-pending before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* Runs before first paint: marks the document while title reveals are not set up yet. */}
        <script dangerouslySetInnerHTML={{ __html: pendingScript() }} />
      </head>
      <body>
        <MotionProvider>
          <CoverProvider>
            <a href="#content" className="target quiet sr-only px-2 focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-40 focus:bg-raised">
              Skip to content
            </a>
            {/* The hairline is a shadow, so the header keeps its 2.5rem (3.75rem on touch) height. */}
            <header className="sticky top-0 z-20 flex items-center gap-2 bg-raised px-2 py-2 text-sm text-paper shadow-[0_1px_0_var(--color-rule)] lg:px-4">
              <NavMenu links={navLinks(chapters)} />
              <RestartButton />
              <MotionSwitch />
            </header>
            {/* Focused only as the skip link's target, so it shows no outline around the whole page. */}
            <div id="content" tabIndex={-1} className="outline-none">
              {children}
            </div>
            <Suspense fallback={null}>
              <FocusOnNavigate />
            </Suspense>
            {/* After the page, so its effect runs once the reveals are set up. */}
            <MotionReady />
          </CoverProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
