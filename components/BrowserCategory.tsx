'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Robotics",
    image: "/robotics2.png",
    description1:
      "Robotics design, automation systems, robotic arm development, ROS integration, and autonomous solutions.",
  },
  {
    title: "Embedded System",
    image: "/embeddedsyatem2.jpg",
    description1:
      "Embedded firmware development, microcontroller programming, RTOS solutions, PCB integration, and hardware prototyping.",
  },
  {
    title: "IoT",
    image: "/iot2.png",
    description1:
      "IoT device development, cloud connectivity, sensor integration, smart automation, and real-time monitoring systems.",
  },
  {
    title: "AI / ML Projects",
    image: "/aiml2.png",
    description1:
      "Machine learning models, computer vision, predictive analytics, NLP applications, and AI-powered automation.",
  },
  {
    title: "Software Projects",
    image: "/software2.png",
    description1:
      "Web applications, mobile apps, SaaS platforms, APIs, enterprise software, and full-stack development.",
  },
];

const BrowserCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[1]);

  const headerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        listRef.current!.children,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        detailRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: detailRef.current,
            start: "top 85%",
          },
        }
      );
    });

    // Fonts, emoji glyphs, and images higher up the page (e.g. the
    // EngineeringSolutions section above this one) can finish loading
    // after ScrollTrigger has already computed its start/end positions,
    // which shifts this section down and desyncs every trigger below it.
    // Refresh once everything has actually settled.
    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener("load", refresh);
    const settleTimeout = setTimeout(refresh, 500);

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      clearTimeout(settleTimeout);
    };
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoRotate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setSelectedCategory((prev) => {
        const currentIndex = categories.findIndex(
          (c) => c.title === prev.title
        );

        return categories[(currentIndex + 1) % categories.length];
      });
    }, 3000);
  };

  useEffect(() => {
    startAutoRotate();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <section id="Categories" className="w-full bg-background py-12 sm:py-16 lg:py-20 px-4 sm:px-6 font-id transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">

        {/* HEADER */}
        <div
          ref={headerRef}
          className=" flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12 " >
          {/* LEFT */}
          <div>
            <p
              className=" text-[42px] sm:text-[54px] lg:text-[64px] font-black leading-[1.0] text-black dark:text-white " >
              Browse by
            </p>

            <div className="flex items-center gap-3 sm:gap-4">
              <div className="h-[3px] w-10 sm:w-16 bg-black dark:bg-white" />

              <p
                className=" text-[42px] sm:text-[54px] lg:text-[64px] font-black leading-[1.0] text-black dark:text-white " >
                Category
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <p className="text-[6px] sm:text-[10px] lg:text-[18px] font-medium text-gray-500 dark:text-slate-400 text-left lg:text-right font-inter lg:mt-4 leading-none">
            Find projects and talent across key
            <br className="hidden sm:block" />
            engineering disciplines
          </p>
        </div>

        {/* MAIN LAYOUT */}
        <div
          className=" grid grid-cols-1 xl:grid-cols-[520px_1fr] gap-10 items-start " >
          {/* LEFT CATEGORIES */}
          <div
            ref={listRef}
            className=" flex flex-col gap-3">
            {categories.map((cat, i) => {
              const active = selectedCategory.title === cat.title;

              return (
                <button
                  key={cat.title}
                  onClick={() => {
                    setSelectedCategory(cat);
                    startAutoRotate(); // reset timer on manual click
                  }}
                  className={` flex items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 sm:py-5 border transition-all duration-300 rounded-none cursor-pointer text-left

                ${active
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-white dark:bg-card text-black dark:text-white border-gray-300 dark:border-slate-800 hover:border-black dark:hover:border-white"
                    }
              `}
                >
                  <span
                    className=" text-[22px] sm:text-[30px] font-bold font-spacegrotesk shrink-0">
                    {i + 1}.
                  </span>

                  <span
                    className=" text-[20px] sm:text-[30px] font-medium font-id leading-tight">
                    {cat.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT CONTENT */}
          <div ref={detailRef} className="min-w-0">

            {/* TITLE */}
            <h3
              className=" text-[34px] sm:text-[42px] lg:text-[50px] font-extrabold text-black dark:text-white text-left lg:text-right leading-tight">
              {selectedCategory.title}
            </h3>

            <h4
              className="text-[14px] sm:text-[15px] lg:text-[17px] text-gray-700 dark:text-slate-300 text-left lg:text-right mb-1 font-inter leading-relaxed">
              {selectedCategory.description1}
            </h4>

            {/* IMAGE */}
            <div
              className=" w-full overflow-hidden mb-6
          "
            >
              <Image
                src={selectedCategory.image}
                alt={selectedCategory.title}
                width={900}
                height={400}
                priority
                onLoad={() => ScrollTrigger.refresh()}
                className=" w-full h-[220px] sm:h-[300px] lg:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowserCategory;
