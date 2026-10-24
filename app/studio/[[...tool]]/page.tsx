import type { Metadata, Viewport } from "next";
import { Studio } from "./Studio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sanity Studio | Tech Engi",
  description: "Content Management Studio for Tech Engi blogs and articles",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioPage() {
  return <Studio />;
}
