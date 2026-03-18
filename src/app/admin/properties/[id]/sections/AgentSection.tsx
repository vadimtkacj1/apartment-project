'use client';

import { Card, Form, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { PropertyFormSectionProps } from '../types';
import { useState, useEffect } from 'react';

interface TeamMember {
  id: number;
  name: string;
  phone?: string;
  mobile?: string;
  role?: string;
  isActive: boolean;
}

interface Owner {
  id: number;
  name: string;
  phone?: string;
  title?: string;
  isActive: boolean;
}

export function AgentSection({ formData, handleChange }: PropertyFormSectionProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);

  useEffect(() => {
    // Load team members
    fetch('/api/admin/team')
      .then((res) => res.json())
      .then((data) => setTeamMembers(data.filter((t: TeamMember) => t.isActive)))
      .catch(() => setTeamMembers([]));

    // Load owners
    fetch('/api/admin/owners')
      .then((res) => res.json())
      .then((data) => setOwners(data.filter((o: Owner) => o.isActive)))
      .catch(() => setOwners([]));
  }, []);

  // Combine owners and team members into one list with prefixes
  const options = [
    {
      label: 'בעלים',
      options: owners.map((o) => ({
        value: `owner-${o.id}`,
        label: `👤 ${o.name}${o.phone ? ` — ${o.phone}` : ''}`,
      })),
    },
    {
      label: 'סוכנים',
      options: teamMembers.map((t) => ({
        value: `team-${t.id}`,
        label: `👔 ${t.name}${t.mobile || t.phone ? ` — ${t.mobile || t.phone}` : ''}`,
      })),
    },
  ];

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
          disabled={teamMembers.length === 0 && owners.length === 0}
          notFoundContent={teamMembers.length === 0 && owners.length === 0 ? 'אין סוכנים או בעלים פעילים' : 'לא נמצא'}
        />
      </Form.Item>
    </Card>
  );
}
