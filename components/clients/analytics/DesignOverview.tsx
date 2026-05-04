'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const DesignOverview = ({ data }: { data: any }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!data) return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-500 mt-4">
      No Design System uploaded yet.
    </div>
  );

  const val = (v: any) => Array.isArray(v) ? v.join(', ') : (typeof v === 'object' && v ? Object.keys(v).join(', ') : v) || 'Not set';

  const slides = [
    [{ label: 'Brand Name', value: val(data.brandName) }, { label: 'Design Type', value: val(data.designType) }, { label: 'Brand Feel', value: val(data.brandFeel) }],
    [{ label: 'Content Tone', value: val(data.contentTone) }, { label: 'Theme', value: val(data.theme) }, { label: 'Key Pages', value: val(data.keyPages) }],
    [{ label: 'Fonts', value: val(data.fonts) }, { label: 'Layout Style', value: val(data.layoutStyle) }, { label: 'Visual Guidelines', value: val(data.visualGuidelines) }],
    [{ label: 'Uniqueness', value: val(data.uniqueness) }],
  ];

  return (
    <div className="dark:bg-gray-900 mt-6">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800 relative">
        <div className="absolute -top-3 left-6">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-sm text-sm font-medium">Design System</span>
        </div>

        <div className="mt-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Colors</h3>
            <div className="flex gap-2">
              {(data.colors ?? []).map((color: string, i: number) => (
                <div
                  key={i}
                  className="group flex items-center h-8 w-8 hover:w-24 px-2 rounded-full border-2 border-gray-200 dark:border-gray-600 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
                  style={{ backgroundColor: color }}
                >
                  <span className="ml-2 text-xs font-semibold text-white opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
                    {color.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden relative h-32">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {slides.map((slide, i) => (
                <div key={i} className="min-w-full space-y-4 pr-4">
                  {slide.map((item, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white max-w-sm truncate" title={item.value}>{item.value}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentSlide(p => (p + 1) % slides.length)}
              className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400 py-1 px-4 rounded-full flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <span className="font-medium">Next Attributes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignOverview;