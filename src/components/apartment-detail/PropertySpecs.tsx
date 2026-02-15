import React from 'react';
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35 }}
      className={`rounded-2xl p-8 shadow-lg border mb-8 ${
        isSold ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-100'
      }`}
    >
      <h2 className={`text-2xl font-black mb-6 ${
        isSold ? 'text-gray-500 line-through' : 'text-gray-900'
      }`}>פרטים נוספים</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {specs.map((spec, index) => {
          const Icon = spec.icon;
          return (
            <div key={index} className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
              isSold
                ? 'bg-gray-200 border-gray-300'
                : 'bg-gray-50 border-gray-100 hover:border-[#1c3664]/30'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full shadow-sm ${
                  isSold ? 'bg-gray-300 text-gray-500' : 'bg-white text-[#1c3664]'
                }`}>
                  <Icon size={18} />
                </div>
                <span className={`font-semibold ${isSold ? 'text-gray-400' : 'text-gray-500'}`}>{spec.label}:</span>
              </div>
              <span className={`font-bold text-lg ${isSold ? 'text-gray-500' : 'text-gray-900'}`}>{spec.value}</span>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
}
