'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ISRAELI_CITIES } from '@/data/cities';
import type { MoonlitContentData } from './content';

/**
 * The template's `advance__search__section` — same markup and classes, with the
 * hotel booking fields replaced by the catalogue's real filters. Submitting
 * just builds a /apartments query string, so results always come from the one
 * listing page.
 */
export default function MoonlitSearchBar({
  content,
  variant = 'is__home__one',
}: {
  /** Admin-managed option lists (/admin/design). */
  content: Pick<MoonlitContentData, 'searchCities' | 'searchRooms' | 'searchBudgets'>;
  variant?: string;
}) {
  const router = useRouter();
  const [dealType, setDealType] = useState('');
  const [city, setCity] = useState('');
  const [minRooms, setMinRooms] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const cities = content.searchCities
    .map((value) => ISRAELI_CITIES.find((c) => c.value === value))
    .filter((c): c is { value: string; label: string } => Boolean(c));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dealType) params.set('dealType', dealType);
    if (city) params.set('city', city);
    if (minRooms) params.set('minRooms', minRooms);
    if (maxPrice) params.set('maxPrice', maxPrice);
    const qs = params.toString();
    router.push(qs ? `/apartments?${qs}` : '/apartments');
  };

  return (
    <div className={`rts__section advance__search__section ${variant}`}>
      <div className="container">
        <div className="row">
          <form onSubmit={submit} className="advance__search">
            <div className="advance__search__wrapper">
              {/* single input */}
              <div className="query__input">
                <label htmlFor="deal__type" className="query__label">
                  סוג עסקה
                </label>
                <select
                  name="deal__type"
                  id="deal__type"
                  className="form-select"
                  value={dealType}
                  onChange={(e) => setDealType(e.target.value)}
                >
                  <option value="">הכול</option>
                  <option value="sale">למכירה</option>
                  <option value="rent">להשכרה</option>
                </select>
                <div className="query__input__icon">
                  <i className="flaticon-calendar" />
                </div>
              </div>
              {/* single input end */}

              {/* single input */}
              <div className="query__input">
                <label htmlFor="search__city" className="query__label">
                  עיר
                </label>
                <select
                  name="search__city"
                  id="search__city"
                  className="form-select"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">כל הערים</option>
                  {cities.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="query__input__icon">
                  <i className="flaticon-calendar" />
                </div>
              </div>
              {/* single input end */}

              {/* single input */}
              <div className="query__input">
                <label htmlFor="search__rooms" className="query__label">
                  חדרים
                </label>
                <select
                  name="search__rooms"
                  id="search__rooms"
                  className="form-select"
                  value={minRooms}
                  onChange={(e) => setMinRooms(e.target.value)}
                >
                  <option value="">הכול</option>
                  {content.searchRooms.map((r) => (
                    <option key={r} value={r}>
                      {r}+ חדרים
                    </option>
                  ))}
                </select>
                <div className="query__input__icon">
                  <i className="flaticon-user" />
                </div>
              </div>
              {/* single input end */}

              {/* single input */}
              <div className="query__input">
                <label htmlFor="search__budget" className="query__label">
                  תקציב
                </label>
                <select
                  name="search__budget"
                  id="search__budget"
                  className="form-select"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  <option value="">ללא הגבלה</option>
                  {content.searchBudgets.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
                <div className="query__input__icon">
                  <i className="flaticon-user" />
                </div>
              </div>
              {/* single input end */}

              {/* submit button */}
              <button type="submit" className="theme-btn btn-style fill no-border search__btn">
                <span>חיפוש נכסים</span>
              </button>
              {/* submit button end */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
