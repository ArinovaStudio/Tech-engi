import Link from "next/link";
import Image from "next/image";
import system from "@/public/saas/tech-engi-systems.png";

export default function CtaSection() {
  return (
    <section className="pt-8 sm:pt-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="reveal relative overflow-hidden rounded-saas-6xl border border-saas-line bg-white/50 p-6 backdrop-blur-lg sm:p-10 lg:p-20">
          <div className="relative z-[2] max-w-full md:max-w-[58%] lg:max-w-[560px]">
            <h2 className="text-balance text-[clamp(1.75rem,6vw,3.9rem)] leading-[1.1]">
              Your next fix <span className="text-saas-mut">starts here.</span>
            </h2>

            <p className="mt-4 text-base sm:text-lg">
              Post the bug, hire an engineer for overflow work, or register to
              start earning — keep 95% of every project.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <Link
                href="/register/client"
                className="btn w-full justify-center text-center sm:w-auto"
              >
                Post your first task
              </Link>
              <Link
                href="/register/engineer"
                className="btn-outline w-full justify-center text-center sm:w-auto"
              >
                Register free
              </Link>
            </div>
          </div>

          <Image
            src={system}
            alt=""
            width={400}
            height={400}
            sizes="(min-width: 1024px) 300px, 30vw"
            className="pointer-events-none absolute right-2 top-1/2 hidden h-auto w-[min(34%,300px)] -translate-y-1/2 md:block lg:right-[-10px]"
          />
        </div>
      </div>
    </section>
  );
}