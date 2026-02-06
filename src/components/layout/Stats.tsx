"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, ThumbsUp, Award } from 'lucide-react';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  index: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="flex flex-col items-center justify-center p-8 group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-3 text-[#C19A6B] transform transition-all duration-300"
      >
        {icon}
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay: index * 0.15 + 0.3,
          type: "spring",
          stiffness: 200
        }}
        className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight"
      >
        {value}
      </motion.div>

      <div className="text-base md:text-lg font-bold text-gray-700 text-center uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Award size={50} strokeWidth={1.5} />,
      value: "20",
      label: "שנות ניסיון בתחום"
    },
    {
      icon: <ThumbsUp size={50} strokeWidth={1.5} />,
      value: "+1,200",
      label: "לקוחות מרוצים"
    },
    {
      icon: <Users size={50} strokeWidth={1.5} />,
      value: "8",
      label: "סוכנים מוסמכים"
    },
    {
      icon: <Building2 size={50} strokeWidth={1.5} />,
      value: "47",
      label: "נכסים בבלעדיות"
    }
  ];

  return (
    <section
      dir="rtl"
      className="relative w-full py-12 md:py-16 bg-white overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-[#1c3664] rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-[#1c3664] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
              index={index}
            />
          ))}
        </div>

        {/* Bottom CTA Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-10"
        >
          <p className="text-lg md:text-xl font-bold text-gray-600 tracking-wide">
            לא במקרה אנחנו אחד מ-10 המשרדים הטובים בחולון בת ים
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
