import React from 'react';
import Link from 'next/link';

import { formatPrice } from './kit';
import MoonlitPropertyForm from './MoonlitPropertyForm';

/**
 * Property page in the moonlit theme — a port of the template's
 * `room-details-1.html`: page hero, then a two-column `sticky-wrap` with the
 * details on the left (price, title, meta, copy, image pair, amenities,
 * features) and the sticky enquiry form on the right.
 *
 * Hotel content is swapped for the listing's real data; the markup, classes and
 * icon set are the template's.
 */

export interface MoonlitPropertyProps {
  /** The serialized PropertyData the classic page already loads. */
  property: Record<string, any>;
  title: string;
  description: string;
}

const FALLBACK = '/images/hero/sales.jpg';

const PARKING_LABELS: Record<string, string> = {
  none: 'ללא חניה',
  single: 'חניה אחת',
  double: 'שתי חניות',
  multiple: 'מספר חניות',
  shared: 'חניה משותפת',
};

const FURNITURE_LABELS: Record<string, string> = {
  none: 'ללא ריהוט',
  partial: 'ריהוט חלקי',
  full: 'ריהוט מלא',
};

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'דירה',
  penthouse: 'פנטהאוז',
  garden: 'דירת גן',
  duplex: 'דופלקס',
  studio: 'סטודיו',
  house: 'בית פרטי',
  cottage: 'קוטג׳',
  land: 'מגרש',
  commercial: 'נכס מסחרי',
};

/** Amenity → the closest icon shipped with the template. */
const AMENITIES: { key: string; label: string; icon: string }[] = [
  { key: 'ac', label: 'מיזוג אוויר', icon: 'snow.svg' },
  { key: 'elevator', label: 'מעלית', icon: 'support.svg' },
  { key: 'sunBalcony', label: 'מרפסת שמש', icon: 'balcony.svg' },
  { key: 'mamad', label: 'ממ״ד', icon: 'security.svg' },
  { key: 'storage', label: 'מחסן', icon: 'room.svg' },
  { key: 'boiler', label: 'דוד שמש', icon: 'shower.svg' },
  { key: 'handicap', label: 'גישה לנכים', icon: 'check-fill.svg' },
  { key: 'bars', label: 'סורגים', icon: 'check-fill.svg' },
  { key: 'mamak', label: 'מחסן דירתי', icon: 'refrigerator.svg' },
  { key: 'solarHeater', label: 'דוד חשמלי', icon: 'hot-coffe.svg' },
];

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export default function MoonlitProperty({ property, title, description }: MoonlitPropertyProps) {
  const images: string[] = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : [FALLBACK];

  const isRent = property.dealType === 'rent' || property.category === 'rentals';
  const priceLabel = `₪${formatPrice(String(property.price ?? ''))}${isRent ? ' / חודש' : ''}`;

  const amenities = AMENITIES.filter((a) => property.amenities?.[a.key]);

  const specs: string[] = [
    property.propertyType && PROPERTY_TYPE_LABELS[property.propertyType]
      ? `סוג הנכס: ${PROPERTY_TYPE_LABELS[property.propertyType]}`
      : null,
    property.floor != null
      ? `קומה ${property.floor}${property.totalFloors ? ` מתוך ${property.totalFloors}` : ''}`
      : null,
    property.bedrooms != null ? `${property.bedrooms} חדרים` : null,
    property.bathrooms != null ? `${property.bathrooms} חדרי רחצה` : null,
    property.area ? `${property.area} מ״ר` : null,
    property.builtArea ? `${property.builtArea} מ״ר בנוי` : null,
    property.parking && PARKING_LABELS[property.parking] ? PARKING_LABELS[property.parking] : null,
    property.furniture && FURNITURE_LABELS[property.furniture] ? FURNITURE_LABELS[property.furniture] : null,
    property.neighborhood ? `שכונה: ${property.neighborhood}` : null,
    property.vacancyDate ? `פינוי: ${property.vacancyDate}` : null,
  ].filter(Boolean) as string[];

  const locationLine = [property.neighborhood, property.location].filter(Boolean).join(' · ');

  return (
    <>
      {/* page header */}
      <div
        className="rts__section page__hero__height page__hero__bg"
        style={{ backgroundImage: `url(${images[0]})` }}
      >
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-12">
              <div className="page__hero__content">
                <h1>{title}</h1>
                <p className="font-sm">{locationLine}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* page header end */}

      {/* room details area */}
      <div className="rts__section section__padding">
        <div className="container">
          <div className="row g-5 sticky-wrap">
            <div className="col-xxl-8 col-xl-7">
              <div className="room__details">
                <span className="h4 price ltr">{priceLabel}</span>
                <h2 className="room__title">{title}</h2>
                <div className="room__meta">
                  {property.area ? (
                    <span>
                      <i className="flaticon-construction" />
                      {property.area} מ״ר
                    </span>
                  ) : null}
                  {property.bedrooms != null ? (
                    <span>
                      <i className="flaticon-user" />
                      {property.bedrooms} חדרים
                    </span>
                  ) : null}
                  {property.floor != null ? (
                    <span>
                      <i className="flaticon-hotel-room" />
                      קומה {property.floor}
                    </span>
                  ) : null}
                </div>

                {description && <p>{description}</p>}

                {images.length > 1 && (
                  <div className="room__image__group row row-cols-md-2 row-cols-sm-1 mt-30 mb-50 gap-4 gap-md-0">
                    {images.slice(1, 3).map((src) => (
                      <div className="room__image__item" key={src}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="rounded-2" src={src} alt={title} />
                      </div>
                    ))}
                  </div>
                )}

                {amenities.length > 0 && (
                  <>
                    <span className="h4 d-block mb-30">מה יש בנכס</span>
                    <div className="room__amenity mb-50">
                      {chunk(amenities, 3).map((group, gi) => (
                        <div className="group__row" key={gi}>
                          {group.map((a) => (
                            <div className="single__item" key={a.key}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={`/moonlit/images/icon/${a.icon}`} height="30" width="36" alt="" />
                              <span>{a.label}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {specs.length > 0 && (
                  <>
                    <span className="h4 d-block mb-50">פרטי הנכס</span>
                    <div className="room__feature mb-30">
                      {images[3] && (
                        <div className="room__feature__image mb-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="rounded-2" src={images[3]} alt={title} />
                        </div>
                      )}
                      <div className="group__row">
                        <ul className="list__item">
                          {specs.map((s) => (
                            <li key={s}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                <p>
                  רוצים לראות את הנכס? השאירו פרטים בטופס — נחזור אליכם ונתאם ביקור בזמן שנוח לכם.{' '}
                  <Link href="/apartments">חזרה לכל הנכסים</Link>
                </p>
              </div>
            </div>

            <div className="col-xxl-4 col-xl-5 sticky-item">
              <MoonlitPropertyForm propertyId={property.id} title={title} price={priceLabel} />
            </div>
          </div>
        </div>
      </div>
      {/* room details area end */}
    </>
  );
}
