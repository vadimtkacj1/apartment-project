'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="he" dir="rtl">
      <body style={{ fontFamily: 'Arial', padding: '2rem', textAlign: 'center', background: '#faf7f2' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>שגיאה</h1>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>משהו השתבש. נסה לרענן את הדף.</p>
        <button
          type="button"
          onClick={() => reset()}
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
