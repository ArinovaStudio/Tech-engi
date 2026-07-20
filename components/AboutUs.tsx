"use client";
import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useScrollAnimation } from "@/lib/useScrollAnimation";

const faqs = [
  {
    question: "How does Tech-ENGI connect clients with engineers?",
    answer: "Clients submit project requirements, and Tech-ENGI matches them with verified engineers based on expertise, budget, and timeline for seamless collaboration and successful project delivery.",
  },
  {
    question: "Can students get help with final year engineering projects?",
    answer:
      "Yes, students can get expert guidance for project planning, development, testing, documentation, and implementation across various engineering domains.",
  },
  {
    question: "What engineering domains are available on Tech-ENGI?",
    answer: "Tech-ENGI supports Robotics, Embedded Systems, IoT, AI/ML, Software Development, Electronics, Automation, PCB Design, Firmware Development, and Product Prototyping.",
  },
  {
    question: "How long does project delivery usually take?",
    answer: "Delivery depends on project complexity. Small projects may take days, while larger development projects can take weeks with regular progress updates.",
  },
  {
    question: "Can startups hire engineers for product development?",
    answer: "Yes, startups can hire engineers for MVP development, prototyping, product design, software development, testing, and scaling innovative products",
  },
];

const testimonials = [
  {
    name: "Ranjith Gowda",
    role: "Robotic Engineer",
    image: "/users/ranjith.jpg",
    text: "The web interface is too good, easy and simple makes it attractive.Mainly the concept is too Good to create a network and connect clients with builders. It will be best flat form for people willing to do freelancing."
  },
  {
    name: "Baisakhi",
    role: "Startup Founder",
    image: "/users/image copy 8.png",
    text: "Client ke perspective se bolun toh yeh platform engineers aur clients ko connect karne ke liye really smooth hai. Communication clear raha aur delivery time pe mila.",
  },
  {
    name: "Sarah Khan",
    role: "Software Engineer",
    image: "/users/image copy 9.png",
    text: "From an engineer’s perspective, the platform is well-structured. Requirements are clear, and it’s easy to collaborate with clients without unnecessary confusion.",
  },
  {
    name: "Ankit Sharma",
    role: "Product Manager",
    image: "/users/image copy 3.png",
    text: "We needed quick technical support for a prototype. The matching process was fast and we got someone who understood the requirements immediately.",
  },
  {
    name: "Neha Verma",
    role: "Freelance Developer",
    image: "/users/image copy 10.png",
    text: "I’ve worked on multiple projects here. The client expectations are clear, and payments and communication are handled smoothly.",
  },
  {
    name: "Rohit Mehta",
    role: "Mechanical Engineer",
    image: "/users/image copy 5.png",
    text: "I collaborated on a simulation project and the requirements were very well explained. It saved a lot of back-and-forth time.",
  },
  {
    name: "Priya Nair",
    role: "Full Stack Developer",
    image: "/users/image copy 11.png",
    text: "Good platform for freelance engineers. The projects feel structured and clients are generally responsive and clear.",
  },
  {
    name: "Aditya Kulkarni",
    role: "Civil Engineer",
    image: "/users/image copy 6.png",
    text: "I helped a client with structural analysis work. Everything from scope to delivery was properly defined, which made execution easier.",
  },
  {
    name: "Simran Kaur",
    role: "UI/UX Designer",
    image: "/users/image copy 13.png",
    text: "Even for design-related technical work, the collaboration was smooth. Feedback cycles were quick and clear.",
  },
  {
    name: "Vikram Singh",
    role: "Backend Engineer",
    image: "/users/image copy 18.png",
    text: "APIs and backend tasks were well documented by clients. It made development faster and less frustrating.",
  },
  {
    name: "Ishita Roy",
    role: "Data Analyst",
    image: "/users/image copy 14.png",
    text: "I worked on a data visualization project. The requirements were specific, and I was able to deliver exactly what was needed.",
  },
  {
    name: "Karan Malhotra",
    role: "Electronics Engineer",
    image: "/users/image copy 19.png",
    text: "IoT project collaboration was smooth. I got clear instructions and minimal confusion during implementation.",
  },
  {
    name: "Ayesha Khan",
    role: "AI/ML Engineer",
    image: "/users/image copy 15.png",
    text: "Worked on a machine learning project. The dataset and goals were clearly defined, which helped a lot in model training.",
  },
  {
    name: "Manish Gupta",
    role: "Technical Consultant",
    image: "/users/image copy 20.png",
    text: "Good experience working with startups through this platform. Requirements are usually practical and well thought out.",
  },
  {
    name: "Jiya Shankar",
    role: "Frontend Developer",
    image: "/users/image copy 16.png",
    text: "UI implementation tasks were easy to understand. Clients gave clear references which made execution faster.",
  },
];

const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(1);
  const testimonialRef = useScrollAnimation('fadeUp')
  const faqRef = useScrollAnimation('fadeUp')
  const [index, setIndex] = useState(0);

  const current = testimonials[index];

  return (
    <div id="Testimonials" className="w-full h-full font-id overflow-hidden">

      {/* ── SECTION 1: TESTIMONIAL ── */}
      <section
        ref={testimonialRef}
        className="relative bg-background overflow-hidden border-b border-gray-200 dark:border-slate-800 transition-colors duration-300"
      >
        {/* ORANGE CIRCLE */}
        <div
          className=" absolute w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] lg:w-[1275px] lg:h-[1275px] rounded-full bg-[#FFAE58] -top-40 -left-60 sm:-top-52 sm:-left-80 lg:-top-60 lg:-left-200 p-[120px] sm:p-[160px] lg:p-[200px] " >
          <div className="w-full h-full rounded-full bg-background transition-colors duration-300" />
        </div>

        <div
          className=" relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-20 py-12 lg:py-16 " >
          <div
            className=" flex flex-col xl:flex-row gap-12 xl:gap-10 items-center xl:items-start " >
            {/* LEFT SIDE */}
            <div
              className=" relative flex flex-col items-center xl:items-start
          "
            >
              <Image
                src={current.image}
                alt={current.name}
                width={434}
                height={631}
                className="w-full h-[420px] sm:h-[520px] lg:h-[631px] object-cover object-top"
              />

              <div className="relative xl:absolute xl:left-80 w-full max-w-[569px] border border-gray-300 dark:border-slate-800 font-inter bg-card shadow-lg p-5 sm:p-6 mt-6 xl:mt-8 transition-colors duration-300">
                <h3 className="text-[28px] sm:text-[40px] font-bold text-black dark:text-white">
                  {current.name}
                </h3>

                <p className="text-[14px] text-gray-400 dark:text-slate-400 mb-4">
                  {current.role}
                </p>

                <p className="text-[16px] sm:text-[20px] text-black dark:text-slate-200 leading-relaxed">
                  {current.text}
                </p>
              </div>

              {/* STARS */}
              <div
                className=" relative xl:absolute xl:left-80 xl:bottom-10 flex items-center gap-2 sm:gap-4 bg-card border border-gray-200 dark:border-slate-800 px-4 sm:px-6 py-3 sm:py-4 shadow-lg mt-6 transition-colors duration-300 " >
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className=" text-[#F7871B] text-[20px] sm:text-[28px] " >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div
              className=" flex-1 text-center xl:text-right " >
              <h2
                className=" leading-tight text-black dark:text-white text-[42px] sm:text-[58px] lg:text-[72px] font-[700] " >
                What others{" "}
                <span className="text-orange-400">think</span>
                <br />
                about us?
              </h2>

              {/* QUOTE */}
              <div
                className=" mt-4 xl:mt-6 mx-auto xl:ml-auto xl:mr-0 w-fit text-[70px] sm:text-[100px] leading-none font-black text-gray-100 dark:text-slate-800 select-none "
                style={{ fontFamily: "Georgia, serif" }}
              >
                "
              </div>

              {/* ARROWS */}
              <div className="flex items-center justify-center xl:justify-end mt-10 xl:mt-40">
                <button
                  onClick={() =>
                    setIndex((prev) =>
                      prev === 0 ? testimonials.length - 1 : prev - 1
                    )
                  }
                  className="w-14 h-14 sm:w-20 sm:h-20 border-2 border-gray-300 dark:border-slate-800 text-gray-500 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  onClick={() =>
                    setIndex((prev) => (prev + 1) % testimonials.length)
                  }
                  className="w-14 h-14 sm:w-20 sm:h-20 border-2 border-gray-300 dark:border-slate-800 text-black dark:text-white flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800/50"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: FAQ ── */}
      <section ref={faqRef} className="bg-background font-inter transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto">

          {/* TOP */}
          <div
            className=" flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 bg-orange-300/10 dark:bg-orange-400/5 px-4 sm:px-8 lg:px-20 pt-10 " >
            {/* HEADING */}
            <div className="flex">
              <h2
                className=" text-[36px] sm:text-[48px] lg:text-[60px] font-medium text-black dark:text-white leading-tight text-center lg:text-left " >
                Things,{" "}
                <span
                  className=" inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFAE58] text-white text-[18px] sm:text-[20px] font-bold " >
                  ?
                </span>{" "}
                you
                <br />
                probably wonder.
              </h2>
            </div>

            {/* IMAGE */}
            <div className="flex justify-center">
              <Image
                src="/girl.png"
                alt="Emoji"
                width={218}
                height={218}
                className=" w-[140px] sm:w-[180px] lg:w-[218px] h-auto object-cover object-bottom " />
            </div>
          </div>

          {/* FAQ LIST */}
          <div
            className=" mt-8 max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-20 space-y-4 pb-12 " >
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 dark:border-slate-800 bg-card transition-colors duration-300">
                <button
                  className=" w-full flex items-center justify-between gap-5 py-5 sm:py-6 px-4 sm:px-5 text-left
              "
                  onClick={() =>
                    setOpenIndex(openIndex === i ? null : i)
                  }
                >
                  <span
                    className={` text-[15px] sm:text-[16px]
                  ${openIndex === i
                        ? "font-semibold text-black dark:text-white"
                        : "text-gray-600 dark:text-slate-300"
                      }
                `}
                  >
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={16}
                    className={` flex-shrink-0 text-gray-400 transition-transform
                  ${openIndex === i ? "rotate-180" : ""}
                `}
                  />
                </button>

                {openIndex === i && faq.answer && (
                  <p
                    className=" pb-4 px-4 sm:px-5 text-[13px] text-gray-500 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
