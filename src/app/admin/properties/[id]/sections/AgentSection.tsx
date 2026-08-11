'use client';

import { User } from 'lucide-react';
import { Card } from '@/components/shadcn/card';
import { Label } from '@/components/shadcn/label';
import { Checkbox } from '@/components/shadcn/checkbox';
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

export function AgentSection({ formData, handleChange, errors }: PropertyFormSectionProps) {
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
  const groups = [
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

  const selected = formData.agentIds ?? [];
  const isEmpty = teamMembers.length === 0 && owners.length === 0;

  const toggle = (value: string, checked: boolean) => {
    const next = checked
      ? [...selected, value]
      : selected.filter((v) => v !== value);
    handleChange('agentIds', next);
  };

  return (
    <Card className="mb-4 p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-foreground">
        <User className="size-4" />
        {t.agent.cardTitle}
      </h3>

      <div id="field-agentIds">
        <Label className="mb-2 block">
          {t.agent.selectLabel} <span className="text-destructive">*</span>
        </Label>

        {isEmpty ? (
          <p className="text-sm text-muted-foreground">{t.agent.noneActive}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {groups.map((group) =>
              group.options.length > 0 ? (
                <div key={group.label}>
                  <div className="mb-2 text-sm font-semibold text-muted-foreground">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.options.map((opt) => (
                      <label key={opt.value} className="flex cursor-pointer items-center gap-2">
                        <Checkbox
                          checked={selected.includes(opt.value)}
                          onCheckedChange={(c) => toggle(opt.value, c === true)}
                        />
                        <span className="text-sm">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        )}

        {errors?.agentIds && (
          <p className="mt-2 text-sm text-destructive">{errors.agentIds}</p>
        )}
      </div>
    </Card>
  );
}
