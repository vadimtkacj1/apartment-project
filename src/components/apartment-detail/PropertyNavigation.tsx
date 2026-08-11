"use client";
import { ChevronRight, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface PropertyNavigationProps {
  previousId: number | null;
  nextId: number | null;
  isSold?: boolean;
}

const navLinkClasses =
  "group flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-elev-1 hover:shadow-elev-2 transition-all duration-300 hover:bg-[#354AC4] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#354AC4] focus-visible:ring-offset-2";

export default function PropertyNavigation({ previousId, nextId }: PropertyNavigationProps) {
  return (
    <div className="flex justify-between items-center gap-4 mb-8">
      {/* Previous Property Link */}
      {previousId ? (
        <Link href={`/apartments/${previousId}`} className={navLinkClasses}>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          <span className="font-semibold">נכס קודם</span>
        </Link>
      ) : (
        <div className="w-32"></div>
      )}

      {/* Next Property Link */}
      {nextId ? (
        <Link href={`/apartments/${nextId}`} className={navLinkClasses}>
          <span className="font-semibold">נכס הבא</span>
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      ) : (
        <div className="w-32"></div>
      )}
    </div>
  );
}
