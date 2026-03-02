"use client";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface PropertyNavigationProps {
  previousId: number | null;
  nextId: number | null;
  isSold?: boolean;
}

export default function PropertyNavigation({ previousId, nextId, isSold }: PropertyNavigationProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      {/* Previous Property Button */}
      {previousId ? (
        <Link href={`/apartments/${previousId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              isSold ? 'opacity-50 pointer-events-none' : 'hover:bg-[#1c3664] hover:text-white'
            }`}
          >
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold">נכס קודם</span>
          </motion.button>
        </Link>
      ) : (
        <div className="w-32"></div> // Spacer to maintain layout
      )}

      {/* Next Property Button */}
      {nextId ? (
        <Link href={`/apartments/${nextId}`}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
              isSold ? 'opacity-50 pointer-events-none' : 'hover:bg-[#1c3664] hover:text-white'
            }`}
          >
            <span className="font-semibold">נכס הבא</span>
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      ) : (
        <div className="w-32"></div> // Spacer to maintain layout
      )}
    </div>
  );
}
