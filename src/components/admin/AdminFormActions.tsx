'use client';

import React from 'react';
import { Button } from 'antd';

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
  /** Omit when `submit` is true and the surrounding <Form> handles submission. */
  onSave?: () => void;
  onCancel: () => void;
  /** Render the save button as a form submit (for pages using antd <Form>). */
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
        type="primary"
        size="large"
        loading={saving}
        htmlType={submit ? 'submit' : 'button'}
        onClick={onSave}
      >
        {saveLabel}
      </Button>
      <Button size="large" onClick={onCancel}>
        {cancelLabel}
      </Button>
    </div>
  );
}
