'use client';

import React, { useState } from 'react';

/**
 * The template's `rts__booking__form is__room__details` sidebar, wired to the
 * site's real enquiry endpoint instead of a hotel booking: same markup, same
 * classes, fields swapped for what a viewing request actually needs.
 */
export default function MoonlitPropertyForm({
  propertyId,
  title,
  price,
}: {
  propertyId: number;
  title: string;
  price: string;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          message: message || `מעוניין בנכס: ${title}`,
          propertyId,
          source: 'moonlit-property',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'שליחה נכשלה');
      setState('done');
      setName('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שליחה נכשלה');
      setState('error');
    }
  };

  return (
    <div className="rts__booking__form has__background is__room__details">
      <form onSubmit={submit} className="advance__search">
        <h5 className="pt-0">תיאום ביקור בנכס</h5>
        <div className="advance__search__wrapper">
          {/* single input */}
          <div className="query__input">
            <label htmlFor="lead__name" className="query__label">
              שם מלא
            </label>
            <div className="query__input__position">
              <input
                type="text"
                id="lead__name"
                name="name"
                placeholder="השם שלכם"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                minLength={2}
              />
              <div className="query__input__icon">
                <i className="flaticon-user" />
              </div>
            </div>
          </div>
          {/* single input end */}

          {/* single input */}
          <div className="query__input">
            <label htmlFor="lead__phone" className="query__label">
              טלפון
            </label>
            <div className="query__input__position">
              <input
                type="tel"
                id="lead__phone"
                name="phone"
                placeholder="050-0000000"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div className="query__input__icon">
                <i className="flaticon-phone-flip" />
              </div>
            </div>
          </div>
          {/* single input end */}

          {/* single input */}
          <div className="query__input">
            <label htmlFor="lead__message" className="query__label">
              הודעה
            </label>
            <div className="query__input__position">
              <input
                type="text"
                id="lead__message"
                name="message"
                placeholder="מתי נוח לכם לראות את הנכס?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="query__input__icon">
                <i className="flaticon-envelope" />
              </div>
            </div>
          </div>
          {/* single input end */}

          {/* calculation */}
          <div className="total__price">
            <span className="total h6 mb-0">מחיר מבוקש</span>
            <span className="price h6 m-0 ltr">{price}</span>
          </div>
          {/* calculation end */}

          {/* submit button */}
          <button type="submit" className="theme-btn btn-style fill no-border" disabled={state === 'sending'}>
            <span>{state === 'sending' ? 'שולח…' : 'שלחו לי פרטים'}</span>
          </button>
          {/* submit button end */}

          {state === 'done' && <p className="mt-15 mb-0">תודה! נחזור אליכם בהקדם.</p>}
          {state === 'error' && error && <p className="mt-15 mb-0">{error}</p>}
        </div>
      </form>
    </div>
  );
}
