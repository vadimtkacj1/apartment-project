"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer dir="rtl" className="relative bg-gray-900 text-white overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C19A6B] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C19A6B] rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-3">
                <Image
                  src="/images/logo.PNG"
                  alt="logo"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">מומחים בתחום הנדל״ן</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              משרד תיווך ושיווק נכסים ופרויקטים של לדל״י ג׳ זיווג למכירה והשכרה, בחולון, בת-ים, יפו ודרום תל אביב.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tight">קישורים מהירים</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-[#C19A6B] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-[#C19A6B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  דף הבית
                </Link>
              </li>
              <li>
                <Link
                  href="/apartments"
                  className="text-gray-300 hover:text-[#C19A6B] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-[#C19A6B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  נכסים למכירה
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-[#C19A6B] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-[#C19A6B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  אודות
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className="text-gray-300 hover:text-[#C19A6B] transition-colors duration-300 flex items-center gap-2 group"
                >
                  <span className="w-2 h-2 bg-[#C19A6B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  צור קשר
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tight">צור קשר</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={20} className="text-[#C19A6B] mt-1 flex-shrink-0" />
                <div>
                  <a href="tel:+972123456789" className="text-gray-300 hover:text-[#C19A6B] transition-colors">
                    03-123-4567
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={20} className="text-[#C19A6B] mt-1 flex-shrink-0" />
                <div>
                  <a href="mailto:info@zamir-realestate.co.il" className="text-gray-300 hover:text-[#C19A6B] transition-colors break-all">
                    info@zamir-realestate.co.il
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-[#C19A6B] mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  חולון, בת ים, ישראל
                </div>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-xl font-black text-white mb-6 uppercase tracking-tight">עקבו אחרינו</h4>

            {/* Social Icons */}
            <div className="flex gap-4 mb-6">
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#C19A6B] transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#C19A6B] transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#C19A6B] transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>

            {/* Working Hours */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h5 className="text-sm font-bold text-white mb-2">שעות פעילות</h5>
              <p className="text-sm text-gray-400">ראשון - חמישי: 9:00 - 18:00</p>
              <p className="text-sm text-gray-400">שישי: 9:00 - 13:00</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-right">
              © {new Date().getFullYear()} כל הזכויות שמורות.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors">
                תנאי שימוש
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#C19A6B] transition-colors">
                מדיניות פרטיות
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
