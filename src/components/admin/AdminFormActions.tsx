'use client';

import React from 'react';
import { Button } from '@/components/shadcn/button';

/**
 * Shared save/cancel row for admin edit forms — start-aligned with the form
 * fields (right in RTL), primary action first in reading order. Stacks to
 * full-width buttons on phones (see .admin-form-actions in antd-admin.css).
 */
export default function AdminFormActions({
  saveLabel,
  cancelLabel,
  saving,
  onSave,
  onCancel,
  submit = false,
}: {
  saveLabel: React.ReactNode;
  cancelLabel: React.ReactNode;
  saving?: boolean;
  /** Omit when `submit` is true and the surrounding <form> handles submission. */
  onSave?: () => void;
  onCancel: () => void;
  /** Render the save button as a form submit (for pages using a <form>). */
  submit?: boolean;
}) {
  return (
    <div
      className="admin-form-actions"
      style={{
        padding: '16px 0',
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      <Button
        size="lg"
        disabled={saving}
        type={submit ? 'submit' : 'button'}
        onClick={onSave}
      >
        {saving ? '…' : saveLabel}
      </Button>
      <Button size="lg" variant="outline" type="button" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
