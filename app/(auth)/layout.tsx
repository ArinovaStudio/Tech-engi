import { figtree } from "@/components/saas/fonts";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${figtree.variable} font-sans min-h-screen bg-white text-slate-900 dark:bg-[#070b14] dark:text-slate-100 antialiased`}>
      {children}
    </div>
  );
}
