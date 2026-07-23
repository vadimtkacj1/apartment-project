'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';

/**
 * Mapping of route segments to Hebrew display names.
 */
const routeNames: Record<string, string> = {
  'apartments': 'דירות',
  'about': 'אודות',
  'faq': 'שאלות נפוצות',
  'admin': 'ניהול',
  'settings': 'הגדרות',
  'users': 'משתמשים',
  'articles': 'מאמרים',
  'foreign-investors': 'משקיעים זרים',
  'selling-alone': 'למכור לבד',
  'selling-apartment': 'מוכרים דירה',
  'buying-apartment': 'קונים דירה',
  'links': 'קישורים שימושיים',
  'privacy-policy': 'מדיניות פרטיות',
  'accessibility': 'נגישות',
};

interface BreadcrumbsProps {
  /** Optional mapping of a path segment to a display label (e.g. { '42': 'דירת גן ברמת גן' }). */
  labels?: Record<string, string>;
}

export default function Breadcrumbs({ labels }: BreadcrumbsProps) {
  const pathname = usePathname();

  // Hide component on the root page
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;
    const isDynamicId = /^\d+$/.test(segment) || /^[a-f0-9-]{36}$/.test(segment);

    let name = labels?.[segment] || routeNames[segment] || segment;
    if (isDynamicId && !labels?.[segment]) name = `#${segment}`;

    return { name, path, isLast };
  });

  return (
    <nav
      className="py-5 px-4 md:px-8 bg-[#f5f7fb]"
      aria-label="מסלול ניווט"
      dir="rtl" // Standard for Hebrew
    >
      <ol className="flex items-center text-base">
        {/* Home Icon Item */}
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
            aria-label="דף הבית"
          >
            <Home className="w-5 h-5" />
          </Link>
        </li>

        {/* Separator - Now with explicit horizontal margins (mx-3) */}
        <li className="text-gray-300 mx-3 select-none" aria-hidden="true">/</li>

        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
            {crumb.isLast ? (
              <span className="font-semibold text-gray-900" aria-current="page">
                {crumb.name}
              </span>
            ) : (
              <>
                <Link
                  href={crumb.path}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {crumb.name}
                </Link>
                {/* Separator with explicit margins to prevent "clumping" */}
                <span className="text-gray-300 mx-3 select-none" aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}