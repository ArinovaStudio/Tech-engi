import React from 'react'
import { CalendarCheck, Users, Award, Shield, Zap, Globe } from 'lucide-react'

const stats = [
  { value: '10K+', label: 'Project Delivered on Time' },
  { value: '1.2K+', label: 'Engineers onboard' },
  { value: '95%', label: 'Clients satisfaction' },
  { value: '10K+', label: 'Project Delivered on Time' },
  { value: '1.2K+', label: 'Engineers onboard' },
  { value: '95%', label: 'Clients satisfaction' },
]

const companyIcons = [
  { icon: Shield, label: 'Secure' },
  { icon: Globe, label: 'Global' },
  { icon: Award, label: 'Premium' },
  { icon: Zap, label: 'Fast' },
  { icon: CalendarCheck, label: 'Reliable' },
]

const Stats = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight text-slate-950">
            Trusted by <span className="italic">builders,</span><br /> startups &amp; growing teams
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {stats.map((item, index) => (
            <div key={index} className="space-y-3">
              <p className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-violet-500 to-orange-400 bg-clip-text text-transparent">
                {item.value}
              </p>
              <p className="text-sm text-slate-500">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-slate-50 px-8 py-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {companyIcons.map((company, index) => {
              const Icon = company.icon
              return (
                <div key={index} className="flex flex-col items-center gap-3 text-slate-600">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <Icon size={28} className="text-slate-900" />
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {company.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stats