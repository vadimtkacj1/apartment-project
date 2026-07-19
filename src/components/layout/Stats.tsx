"use client";
import React, { useEffect, useRef, useState } from 'react';
import { m, useInView } from 'framer-motion';
import { Building2, Users, ThumbsUp, Award } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  index: number;
}

/**
 * Counts up to a numeric target once it scrolls into view. Preserves any
 * non-digit prefix / suffix (e.g. the leading "+") and thousands separators,
 * and honours prefers-reduced-motion by rendering the final value immediately.
 * The initial (SSR / pre-view) render shows the real number, so no-JS and
 * crawlers still read the true figure.
 */
const CountUp: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const reduced = usePrefersReducedMotion();

  const match = value.match(/^(\D*)([\d,]+)(.*)$/);
  const prefix = match?.[1] ?? '';
  const target = match ? parseInt(match[2].replace(/,/g, ''), 10) : 0;
  const suffix = match?.[3] ?? '';
  const zeroText = `${prefix}0${suffix}`;

  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced || !match) { setDisplay(value); return; }
    if (!inView) { setDisplay(zeroText); return; }

    let raf = 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      setDisplay(`${prefix}${current.toLocaleString('en-US')}${suffix}`);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplay(value);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  return <span ref={ref} dir="ltr">{display}</span>;
};

const StatItem: React.FC<StatItemProps> = ({ icon, value, label, index }) => {
  return (
    <m.div
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
      <m.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="mb-4 text-[#051150]"
      >
        {icon}
      </m.div>

      <m.div
        initial={{ scale: 0.8 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.6,
          delay: index * 0.1 + 0.2,
          type: "spring",
          stiffness: 100
        }}
        className="text-3xl font-black text-gray-900 mb-2 tracking-tight"
        style={{ fontFamily: 'var(--font-caramel), cursive, sans-serif' }}
      >
        <CountUp value={value} />
      </m.div>

      <div className="text-base md:text-lg font-bold text-gray-600 text-center">
        {label}
      </div>
    </m.div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    {
      icon: <Award size={56} strokeWidth={1.5} />,
      value: "+24",
      label: "שנות ניסיון בתחום"
    },
    {
      icon: <ThumbsUp size={56} strokeWidth={1.5} />,
      value: "+1,200",
      label: "לקוחות מרוצים"
    },
    {
      icon: <Users size={56} strokeWidth={1.5} />,
      value: "4",
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
      className="relative w-full pt-24 md:pt-32 pb-12 overflow-hidden bg-warm"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Eyebrow */}
        <div className="text-center mb-12 md:mb-14">
          <span className="block text-[13px] md:text-sm font-semibold text-[#354AC4]">
            במספרים
          </span>
        </div>

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