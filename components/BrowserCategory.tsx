'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    title: "Robotics",
    image: "/robotics.jpg",
    description1:
      "Advanced robotics projects including automation systems, robotic arms, industrial robots, and intelligent control systems.",
    description2:
      "Build modern robotics solutions with AI integration, sensors, motion systems, and embedded hardware platforms.",
  },
  {
    title: "Embedded System",
    image: "/embedded-system.jpg",
    description1:
      "Embedded system development using microcontrollers, RTOS, firmware engineering, and hardware integration.",
    description2:
      "Design scalable embedded architectures for IoT devices, automotive systems, and industrial electronics.",
  },
  {
    title: "IoT",
    image: "/iot.jpg",
    description1:
      "IoT solutions with cloud connectivity, smart devices, sensor networks, and real-time monitoring systems.",
    description2:
      "Develop smart ecosystems connecting devices, APIs, dashboards, and edge computing infrastructures.",
  },
  {
    title: "AI / ML Projects",
    image: "/ai-ml.jpg",
    description1:
      "Artificial Intelligence and Machine Learning systems including NLP, computer vision, and predictive analytics.",
    description2:
      "Train intelligent models using modern frameworks and deploy scalable AI-powered applications.",
  },
  {
    title: "Software Projects",
    image: "/software.jpg",
    description1:
      "Full-stack software development projects covering web apps, SaaS platforms, APIs, and enterprise systems.",
    description2:
      "Build scalable modern applications using advanced frontend, backend, and cloud technologies.",
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

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full bg-white py-20 px-6 font-id">
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-start justify-between mb-12"
        >
          <div>
            <p className="text-[64px] font-black leading-[1.0] text-black">
              Browse by
            </p>

            <div className="flex items-center gap-4">
              <div className="h-[3px] w-16 bg-black" />

              <p className="text-[64px] font-black leading-[1.0] text-black">
                Category
              </p>
            </div>
          </div>

          <p className="text-[30px] font-medium text-black text-right font-inter mt-4">
            Find projects and talent across key
            <br />
            engineering disciplines
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-[520px_1fr] gap-10 items-start">

          {/* Left Categories */}
          <div ref={listRef} className="flex flex-col gap-3">
            {categories.map((cat, i) => {
              const active = selectedCategory.title === cat.title;

              return (
                <button
                  key={cat.title}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-5 px-6 py-5 border transition-all duration-300 rounded-none cursor-pointer text-left ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-300 hover:border-black"
                  }`}
                >
                  <span className="text-[30px] font-bold font-spacegrotesk">
                    {i + 1}.
                  </span>

                  <span className="text-[30px] font-medium font-id">
                    {cat.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Content */}
          <div ref={detailRef}>
            <h3 className="text-[50px] font-bold text-black text-right mb-4">
              {selectedCategory.title}
            </h3>

            <div className="w-full overflow-hidden rounded-sm mb-6">
              <Image
                src={selectedCategory.image}
                alt={selectedCategory.title}
                width={560}
                height={200}
                className="w-full h-50 object-cover"
                priority
              />
            </div>

            <p className="text-[15px] text-gray-600 text-right mb-4 font-inter">
              {selectedCategory.description1}
            </p>

            <p className="text-[15px] text-gray-600 text-right font-inter">
              {selectedCategory.description2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowserCategory;