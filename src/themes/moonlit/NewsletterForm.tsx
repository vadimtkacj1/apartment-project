'use client';

import React, { useState } from 'react';

/**
 * The template's footer newsletter band. There is no newsletter backend on this
 * site, so the block captures a real callback request instead and posts it to
 * the existing /api/contact endpoint (which requires a name + Israeli phone).
 */
export default function NewsletterForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
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
          message: 'בקשה לחזרה טלפונית מהפוטר',
          source: 'moonlit-footer',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'שליחה נכשלה');
      setState('done');
      setName('');
      setPhone('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שליחה נכשלה');
      setState('error');
    }
  };

  return (
    <div className="rts__form">
      <form onSubmit={submit}>
        <input
          type="text"
          name="name"
          id="newsletter__name"
          placeholder="שם מלא"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          aria-label="שם מלא"
        />
        <input
          type="tel"
          name="phone"
          id="newsletter__phone"
          placeholder="טלפון"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          dir="ltr"
          aria-label="מספר טלפון"
        />
        <button type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'שולח…' : 'שלחו לי נכסים'}
        </button>
      </form>
      {state === 'done' && <p className="mt-15 mb-0">תודה! נחזור אליכם בהקדם.</p>}
      {state === 'error' && error && <p className="mt-15 mb-0">{error}</p>}
    </div>
  );
}
