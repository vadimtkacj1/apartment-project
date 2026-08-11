/**
 * Copies text to the clipboard, returning whether it worked.
 *
 * `navigator.clipboard` only exists in secure contexts (https / localhost), so
 * on a plain-http preview host it is simply undefined — the legacy
 * `execCommand('copy')` path keeps the button working there instead of failing
 * silently.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Permission denied or non-secure context — fall through to the legacy path.
  }

  if (typeof document === 'undefined') return false;

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    // Keep it off-screen but focusable: `display: none` would break select().
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

/** Absolute public URL of a property page, for sharing. */
export function propertyShareUrl(id: number | string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/apartments/${id}`;
}
