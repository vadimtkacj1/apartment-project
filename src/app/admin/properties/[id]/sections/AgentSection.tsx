'use client';

import { Card, Form, Select } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAdminMessages } from '@/lib/adminI18n';
import { propertyFormMessages } from '@/lib/adminI18n/messages/propertyForm';
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
  const t = useAdminMessages(propertyFormMessages);
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
      label: t.agent.ownersGroup,
      options: owners.map((o) => ({
        value: `owner-${o.id}`,
        label: `👤 ${o.name}${o.phone ? ` — ${o.phone}` : ''}`,
      })),
    },
    {
      label: t.agent.agentsGroup,
      options: teamMembers.map((member) => ({
        value: `team-${member.id}`,
        label: `👔 ${member.name}${member.mobile || member.phone ? ` — ${member.mobile || member.phone}` : ''}`,
      })),
    },
  ];

  return (
    <Card
      title={
        <>
          <UserOutlined style={{ marginInlineEnd: '8px' }} />
          {t.agent.cardTitle}
        </>
      }
      className="mb-4"
    >
      <Form.Item
        label={t.agent.selectLabel}
        name="agentIds"
        rules={[
          {
            required: true,
            type: 'array',
            min: 1,
            message: t.agent.required,
          },
        ]}
      >
        <Select
          mode="multiple"
          placeholder={t.agent.placeholder}
          options={options}
          value={formData.agentIds}
          onChange={(ids) => handleChange('agentIds', ids)}
          disabled={teamMembers.length === 0 && owners.length === 0}
          notFoundContent={teamMembers.length === 0 && owners.length === 0 ? t.agent.noneActive : t.agent.notFound}
        />
      </Form.Item>
    </Card>
  );
}
