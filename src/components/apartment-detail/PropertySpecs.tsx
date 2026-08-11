import React from 'react';
import { m } from 'framer-motion';

interface Spec {
  label: string;
  value: string;
  icon: any;
}

interface PropertySpecsProps {
  specs: Spec[];
  isSold: boolean;
}

export function PropertySpecs({ specs, isSold }: PropertySpecsProps) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className={`rounded-2xl p-8 shadow-lg border mb-8 ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-3xl font-black mb-8 ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>פרטים נוספים</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div key={index} className={`flex items-center justify-between p-5 rounded-xl border transition-colors ${
              isSold
                ? 'bg-gray-200 border-gray-300'
                : 'bg-gray-50 border-gray-100 hover:border-[#1c3664]/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-full shadow-sm ${
                  isSold ? 'bg-gray-300 text-gray-500' : 'bg-white text-[#1c3664]'
                }`}>
                  <Icon size={20} />
                </div>
                <span className={`font-semibold text-base ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>{spec.label}:</span>
              </div>
              <span className={`font-bold text-xl ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>{spec.value}</span>
            </div>
          )
        })}
      </div>
    </m.div>
  );
}
