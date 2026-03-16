'use client';

import { Card, Form, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PropertyFormSectionProps } from '../types';
import { useState, useEffect } from 'react';

interface Owner {
  id: number;
  name: string;
  phone: string;
  whatsapp?: string;
  title?: string;
  isActive: boolean;
}

export function AgentSection({ formData, handleChange }: PropertyFormSectionProps) {
  const [owners, setOwners] = useState<Owner[]>([]);

  useEffect(() => {
    fetch('/api/admin/owners')
      .then((res) => res.json())
      .then((data) => setOwners(data.filter((o: Owner) => o.isActive)))
      .catch(() => setOwners([]));
  }, []);

  const options = owners.map((o) => ({
    value: o.id,
    label: `${o.name}${o.phone ? ` — ${o.phone}` : ''}`,
  }));

  return (
    <Card
      title={
        <>
          <UserOutlined style={{ marginLeft: '8px' }} />
          סוכן נדל״ן (חובה)
        </>
      }
      className="mb-4"
    >
      <Form.Item
        label="בחר לפחות סוכן אחד לנכס"
        name="agentIds"
        rules={[
          {
            required: true,
            type: 'array',
            min: 1,
            message: 'יש לבחור לפחות סוכן אחד',
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder="בחר סוכן/ים"
          options={options}
          value={formData.agentIds}
          onChange={(ids) => handleChange('agentIds', ids)}
          disabled={owners.length === 0}
          notFoundContent={owners.length === 0 ? 'אין סוכנים פעילים. הוסף ב"בעלים/סוכנים"' : 'לא נמצא'}
        />
      </Form.Item>
    </Card>
  );
}
