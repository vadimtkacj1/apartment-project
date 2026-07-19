'use client';

import { useEffect } from 'react';

// A tab left open across a deploy references JS chunks that no longer exist
// on the server; that failure is fixed by a full page reload, never by
// reset(). Wording differs per browser/bundler, so match broadly.
function isStaleChunkError(error: Error): boolean {
  const text = `${error.name} ${error.message}`;
  return /ChunkLoadError|Loading chunk|Failed to load chunk|dynamically imported module|Importing a module script failed/i.test(
    text
  );
}

const RELOADED_AT_KEY = 'global-error-reloaded-at';

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!isStaleChunkError(error)) return;
    try {
      // One automatic attempt per half-minute: if the reload lands back here
      // the failure isn't a stale deploy, so leave the manual UI instead of
      // reload-looping.
      const last = Number(window.sessionStorage.getItem(RELOADED_AT_KEY)) || 0;
      if (Date.now() - last < 30_000) return;
      window.sessionStorage.setItem(RELOADED_AT_KEY, String(Date.now()));
    } catch {
      return;
    }
    window.location.reload();
  }, [error]);

  return (
    <html lang="he" dir="rtl">
      <body style={{ fontFamily: 'Arial', padding: '2rem', textAlign: 'center', background: '#f5f7fb' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>שגיאה</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>משהו השתבש. נסה לרענן את הדף.</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          נסה שוב
        </button>
      </body>
    </html>
  );
}
