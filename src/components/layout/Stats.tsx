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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut"
      }}
      className="flex flex-col items-center justify-center p-4 group transition-all duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-4 text-[#C19A6B]"
      >
        {icon}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 100
        }}
        className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight"
      >
        {value}
      </motion.div>

      <div className="text-base md:text-lg font-bold text-gray-600 text-center uppercase tracking-wide">
        {label}
      </div>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Award size={56} strokeWidth={1.5} />,
      value: "20",
      label: "שנות ניסיון בתחום"
    },
    {
      icon: <ThumbsUp size={56} strokeWidth={1.5} />,
      value: "+1,200",
      label: "לקוחות מרוצים"
    },
    {
      icon: <Users size={56} strokeWidth={1.5} />,
      value: "8",
      label: "סוכנים מוסמכים"
    },
    {
      icon: <Building2 size={56} strokeWidth={1.5} />,
      value: "47",
      label: "נכסים בבלעדיות"
    }
  ];

  return (
    <section
      dir="rtl"
      className="relative w-full pt-24 md:pt-32 pb-12 bg-white overflow-hidden"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-8">
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
      </div>
    </section>
  );
};

export default Stats;