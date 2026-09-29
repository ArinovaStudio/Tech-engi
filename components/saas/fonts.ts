import { Figtree } from "next/font/google";

// Landing-only font. The CSS variable is applied on the .saas-root wrapper,
// so the rest of the app keeps its own fonts (IDGrotesk / Inter).
export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-figtree",
  display: "swap",
});
