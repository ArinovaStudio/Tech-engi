import { CalendarCheck, Users, Award, Shield, Zap, Globe } from 'lucide-react'
import Image from 'next/image';
import ScrollReveal from '@/components/ScrollReveal'

const stats = [
  { value: '500+', label: 'Projects Successfully Delivered' },
  { value: '300+', label: 'Verified Engineers Onboarded' },
  { value: '95%', label: 'Client Satisfaction Rate' },
  { value: '150+', label: 'Startup Projects Supported' },
  { value: '15+', label: 'Engineering Domains Covered' },
  { value: '24/7', label: 'Project Assistance Available' },
]

const companyIcons = [
  { src: '/partner/image.png', label: 'vsCode' },
  { src: '/partner/image copy.png', label: 'rasbaripi' },
  { src: '/partner/image copy 2.png', label: 'c' },
  { src: '/partner/image copy 3.png', label: 'c++' },
  { src: '/partner/image copy 4.png', label: 'c#' },
  { src: '/partner/image copy 5.png', label: 'java' },
  { src: '/partner/image copy 12.png', label: 'python' },
  { src: '/partner/image copy 11.png', label: 'figma' },
  { src: '/partner/image copy 8.png', label: 'react' },
  { src: '/partner/image copy 9.png', label: 'Kotline' },
  { src: '/partner/image copy 10.png', label: 'postgrsql' },
  { src: '/partner/image copy 7.png', label: 'django' },
]

const Stats = () => {
  return (
    <section className="w-full bg-background py-20 px6 font-inter transition-colors duration-300">
      <div className="mx-auto">
        <ScrollReveal animation="fadeUp" className="text-center mb-18">
          <h2 className="text-[40px] lg:text-[50px] font-semibold leading-tight text-slate-950 dark:text-white">
            Trusted by <span className="italic">builders,</span><br /> startups &amp; growing teams
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fadeUp" className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((item, index) => (
            <div key={index} >
              <p className="text-[50px] lg:text-[70px] font-semibold bg-[linear-gradient(106.71deg,#00BBFF_16.24%,#C15DFF_53.84%,#FFAE58_69.09%)] bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-[20px] text-[#4B4B4B] dark:text-slate-350 font-id">{item.label}</p>
            </div>
          ))}
        </ScrollReveal>

        <ScrollReveal animation="fadeUp" className="mt-26 w-full h-full border border-slate-200 dark:border-slate-800 bg-card py-8 w-full overflow-hidden transition-colors duration-300">
          <div className="flex animate-marquee items-center">
            {[...companyIcons, ...companyIcons].map((company, index) => (
              <div key={index} className="flex-shrink-0 h-10 w-[190px] lg:w-[290px] h-[60px] relative">
                <Image src={company.src} alt={company.label} fill className="object-contain" />
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

export default Stats