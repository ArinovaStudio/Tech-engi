"use client";
import React from 'react'
import { CalendarCheck, Users, Award, Shield, Zap, Globe } from 'lucide-react'
import { useScrollAnimation } from '@/lib/useScrollAnimation'
import Image from 'next/image';

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
  const headingRef = useScrollAnimation('fadeUp')
  const gridRef = useScrollAnimation('fadeUp')
  const iconsRef = useScrollAnimation('fadeUp')

  return (
    <section className="w-full bg-white py-20 px6 font-inter">
      <div className="mx-auto">
        <div ref={headingRef} className="text-center mb-18">
          <h2 className="text-[40px] lg:text-[50px] font-semibold leading-tight text-slate-950">
            Trusted by <span className="italic">builders,</span><br /> startups &amp; growing teams
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((item, index) => (
            <div key={index} >
              <p className="text-[50px] lg:text-[70px] font-semibold bg-[linear-gradient(106.71deg,#00BBFF_16.24%,#C15DFF_53.84%,#FFAE58_69.09%)] bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-[20px] text-[#4B4B4B] font-id">{item.label}</p>
            </div>
          ))}
        </div>

        <div ref={iconsRef} className="mt-26 w-full h-full border border-slate-200 py-8 w-full overflow-hidden">
          <div className="flex animate-marquee items-center">
            {[...companyIcons, ...companyIcons].map((company, index) => (
              <div key={index} className="flex-shrink-0 h-10 w-[190px] lg:w-[290px] h-[60px] relative">
                <Image src={company.src} alt={company.label} fill className="object-contain" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats