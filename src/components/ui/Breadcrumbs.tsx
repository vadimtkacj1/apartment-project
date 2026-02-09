'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home } from 'lucide-react';
import Script from 'next/script';

const routeNames: Record<string, string> = {
  'apartments': 'דירות',
  'about': 'אודות',
  'faq': 'שאלות נפוצות',
  'admin': 'ניהול',
  'settings': 'הגדרות',
  'users': 'משתמשים',
};

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(segment => segment !== '');

  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const isLast = index === segments.length - 1;

    const isDynamicId = /^\d+$/.test(segment) || /^[a-f0-9-]{36}$/.test(segment);

    let name = routeNames[segment] || segment;
    if (isDynamicId) {
      name = `#${segment}`;
    }

    return {
      name,
      path,
      isLast,
    };
  });

  return (
    <>
      <nav
        className="bg-white border-b border-gray-200 py-3 px-4 md:px-8"
        aria-label="Breadcrumb"
        dir="rtl"
        style={{ fontFamily: 'var(--font-open-sans), Arial, Helvetica, sans-serif' }}
      >
        <ol className="flex items-center space-x-2 space-x-reverse text-sm">
          <li>
            <Link
              href="/"
              className="text-gray-500 hover:text-gray-700 transition-colors flex items-center"
              aria-label="עמוד הבית"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>

          <li className="text-gray-400">/</li>

          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.path} className="flex items-center space-x-2 space-x-reverse">
              {crumb.isLast ? (
                <span className="font-medium text-gray-900">
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
                  <span className="text-gray-400">/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
