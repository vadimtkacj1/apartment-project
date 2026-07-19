import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  error?: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-warm pt-8 pb-16" dir="rtl">
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-600 text-xl mb-4">{error || 'נכס לא נמצא'}</p>
        <Link
          href="/apartments"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#354AC4] text-white font-bold rounded-xl hover:bg-[#28389B] transition-colors"
        >
          <span>חזרה לנכסים</span>
          <ArrowLeft size={20} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
