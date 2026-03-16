"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone, User } from "lucide-react";
import { analytics } from "@/lib/analytics";

export interface Agent {
  id: number;
  name: string;
  phone?: string;
  whatsapp?: string;
}

interface PropertyAgentBlockProps {
  agents: Agent[];
  isSold?: boolean;
  propertyId?: string;
}

function formatWhatsAppNumber(num: string): string {
  const digits = num.replace(/\D/g, "");
  if (digits.startsWith("972")) return digits;
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return "972" + digits;
}

export function PropertyAgentBlock({
  agents,
  isSold,
  propertyId,
}: PropertyAgentBlockProps) {
  if (!agents || agents.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mb-8 rounded-2xl border bg-white p-6 shadow-lg ${
        isSold ? "border-gray-200 opacity-70" : "border-gray-100"
      }`}
    >
      <h3 className="mb-4 text-xl font-bold text-[#1c3664]">יצירת קשר</h3>
      <div className="flex flex-col gap-4">
        {agents.map((agent) => {
          const whatsappNum = agent.whatsapp || agent.phone;
          const whatsappLink = whatsappNum
            ? `https://wa.me/${formatWhatsAppNumber(whatsappNum)}`
            : null;

          return (
            <div
              key={agent.id}
              className="flex flex-wrap items-center gap-3 rounded-xl bg-gray-50 p-4"
            >
              <div className="flex items-center gap-2 text-gray-900">
                <User size={18} className="text-[#1c3664]" />
                <span className="font-semibold">{agent.name}</span>
              </div>
              {agent.phone && (
                <a
                  href={`tel:${agent.phone.replace(/\D/g, "")}`}
                  onClick={() => propertyId && analytics.trackPhoneClick(propertyId)}
                  className={`inline-flex items-center gap-1.5 font-medium ${
                    isSold ? "pointer-events-none text-gray-500" : "text-[#1c3664] hover:underline"
                  }`}
                >
                  <Phone size={16} />
                  {agent.phone}
                </a>
              )}
              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => propertyId && analytics.trackWhatsAppClick(propertyId)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition-colors ${
                    isSold
                      ? "pointer-events-none bg-gray-200 text-gray-500"
                      : "bg-[#25D366] text-white hover:bg-[#20bd5a]"
                  }`}
                >
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
