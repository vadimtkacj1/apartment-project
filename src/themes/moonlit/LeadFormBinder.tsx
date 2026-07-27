'use client';

import { useEffect } from 'react';

/**
 * Interactivity for a form that lives inside template HTML.
 *
 * The template's pages are rendered as-is, so their forms are plain markup, not
 * React. Rather than cut the DOM apart to insert a component, this binds a
 * submit handler to `#moonlit-lead-form` and posts to the site's real endpoint.
 */
export default function LeadFormBinder({ propertyId, title }: { propertyId?: number; title?: string }) {
  useEffect(() => {
    const form = document.getElementById('moonlit-lead-form') as HTMLFormElement | null;
    if (!form) return;

    const note = document.getElementById('moonlit-lead-note');
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    const buttonLabel = button?.querySelector('span');
    const originalLabel = buttonLabel?.textContent ?? '';

    const say = (text: string) => {
      if (note) note.textContent = text;
    };

    const onSubmit = async (e: Event) => {
      e.preventDefault();
      const data = new FormData(form);
      if (button) button.disabled = true;
      if (buttonLabel) buttonLabel.textContent = 'שולח…';
      say('');

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: String(data.get('name') ?? ''),
            phone: String(data.get('phone') ?? ''),
            message: String(data.get('message') ?? '') || (title ? `מעוניין בנכס: ${title}` : 'פנייה מהאתר'),
            propertyId,
            source: 'moonlit-property',
          }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json?.error || 'שליחה נכשלה');
        form.reset();
        say('תודה! נחזור אליכם בהקדם.');
      } catch (err) {
        say(err instanceof Error ? err.message : 'שליחה נכשלה');
      } finally {
        if (button) button.disabled = false;
        if (buttonLabel) buttonLabel.textContent = originalLabel;
      }
    };

    form.addEventListener('submit', onSubmit);
    return () => form.removeEventListener('submit', onSubmit);
  }, [propertyId, title]);

  return null;
}
