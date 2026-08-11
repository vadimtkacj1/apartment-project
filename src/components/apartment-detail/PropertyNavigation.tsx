"use client";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { m } from 'framer-motion';

interface PropertyNavigationProps {
  previousId: number | null;
  nextId: number | null;
  isSold?: boolean;
}

export default function PropertyNavigation({ previousId, nextId }: PropertyNavigationProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      {/* Previous Property Button */}
      {previousId ? (
        <Link href={`/apartments/${previousId}`}>
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#1c3664] hover:text-white"
          >
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold">נכס קודם</span>
          </m.button>
        </Link>
      ) : (
        <div className="w-32"></div>
      )}

      {/* Next Property Button */}
      {nextId ? (
        <Link href={`/apartments/${nextId}`}>
          <m.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:bg-[#1c3664] hover:text-white"
          >
            <span className="font-semibold">נכס הבא</span>
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </m.button>
        </Link>
      ) : (
        <div className="w-32"></div>
      )}
    </div>
  );
}
