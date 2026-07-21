'use client';

import { Toaster as SonnerToaster, toast } from 'sonner';

import { useAdminI18n } from '@/lib/adminI18n';

function AdminToaster() {
  const { dir } = useAdminI18n();

  return (
    <SonnerToaster
      dir={dir}
      position={dir === 'rtl' ? 'top-left' : 'top-right'}
      richColors
      closeButton
      toastOptions={{
        style: {
          fontFamily: 'var(--font-assistant), Arial, Helvetica, sans-serif',
        },
      }}
    />
  );
}

export { AdminToaster };
export { toast };
