import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google";
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
      <body>{children}</body>
    </html>
  );
}
