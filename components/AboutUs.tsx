import Image from "next/image"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"

const faqs = [
  {
    question: "How is Uvodo different from other eCommerce platforms?",
    answer: "Uvodo offers a streamlined onboarding experience, low fees, and built-in project matching for tech buyers and builders."
  },
  {
    question: "Can I use my own domain with Uvodo?",
    answer: "Yes, you can connect your existing domain. Uvodo also provides a forever free uvo.do domain suffix to all sellers upon creating an account."
  },
  {
    question: "Can I sell my products with Uvodo without creating an online store?",
    answer: "Yes. Uvodo supports listing services and digital products directly, with minimal setup and an easy product management flow."
  },
  {
    question: "Is there a setup fee for using Uvodo?",
    answer: "No, there is no upfront setup fee. You only pay when projects are matched and work begins."
  },
  {
    question: "In what countries can I use Uvodo?",
    answer: "Uvodo is currently available globally, with support for major regions and local payments coming soon."
  }
]

const AboutUs = () => {
  return (
    <section className="relative overflow-hidden bg-white py-24 px-6">
      <div className="absolute left-0 top-0 h-[450px] w-[450px] rounded-full bg-orange-200/90 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="mx-auto flex max-w-7xl flex-col gap-16 lg:flex-row lg:items-start">
        <div className="relative lg:w-1/2">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_50px_100px_-60px_rgba(15,23,42,0.2)]">
            <Image
              src="/white-guy.jpg"
              alt="Customer testimonial portrait"
              width={760}
              height={920}
              className="h-[620px] w-full object-cover"
              priority
            />
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="max-w-2xl space-y-8">
            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-500">What others</p>
              <h2 className="text-5xl font-black leading-tight text-slate-950">
                think about us?
              </h2>
            </div>

            <div className="relative rounded-[2rem] bg-white p-8 shadow-xl">
              <div className="absolute right-6 top-6 text-7xl font-black text-orange-100">“</div>
              <div className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-950">Cecilia Pouros</h3>
                  <p className="text-sm text-slate-500">Regional Markets Executive</p>
                </div>
                <p className="text-sm leading-7 text-slate-600">
                  Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                </p>

                <div className="inline-flex items-center gap-1 rounded-full bg-slate-950 px-4 py-2 text-sm text-white">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span key={index}>★</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-500">
                <ArrowLeft size={18} />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-500">
                <ArrowRight size={18} />
              </button>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-950">Things, you probably wonder.</h3>
              <div className="mt-6 space-y-4">
                {faqs.map((faq, index) => (
                  <details key={index} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-slate-950">
                      {faq.question}
                      <Plus size={18} />
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs