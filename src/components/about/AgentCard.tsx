'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Phone, Mail } from 'lucide-react';
import type { TeamMember } from '@/app/(public)/about/aboutData';

interface AgentCardProps {
  member: TeamMember;
  index: number;
  inView: boolean;
}

export default function AgentCard({ member, index, inView }: AgentCardProps) {
  return (
    <motion.div
      className="agent-card-horizontal"
      initial={{ x: 50, opacity: 0 }}
      animate={inView ? { x: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      <div className="agent-content">
        <div className="agent-text">
          <h3 className="agent-name">{member.name}</h3>
          <p className="agent-role">{member.role}</p>
          <p className="agent-description">{member.description}</p>
          <div className="agent-contact-info">
            <a href={`tel:${member.phone}`} className="contact-link">
              <Phone size={18} />
              <span>{member.phone}</span>
            </a>
            <a href={`tel:${member.mobile}`} className="contact-link">
              <Phone size={18} />
              <span>{member.mobile}</span>
            </a>
            <a href={`mailto:${member.email}`} className="contact-link">
              <Mail size={18} />
              <span>{member.email}</span>
            </a>
          </div>
        </div>
        <div className="agent-image-container">
          <Image
            src={member.image}
            alt={member.name}
            width={300}
            height={350}
            className="agent-photo"
          />
        </div>
      </div>
    </motion.div>
  );
}
