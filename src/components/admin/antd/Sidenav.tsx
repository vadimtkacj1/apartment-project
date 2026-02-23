'use client';

import { Menu, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidenavProps {
  color: string;
  onClose: () => void;
}

export default function Sidenav({ color, onClose }: SidenavProps) {
  const pathname = usePathname();

  const navItems = [
    {
      key: 'dashboard',
      href: '/admin',
      label: 'לוח בקרה',
      isActive: pathname === '/admin' || pathname === '/admin/',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" />
          <path d="M3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" />
          <path d="M14 9C13.4477 9 13 9.44771 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44771 16.5523 9 16 9H14Z" />
        </svg>
      ),
    },
    {
      key: 'properties',
      href: '/admin/properties',
      label: 'נכסים',
      isActive: pathname.includes('/properties'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2L3 7V18H8V13H12V18H17V7L10 2Z" />
        </svg>
      ),
    },
    {
      key: 'homepage',
      href: '/admin/homepage',
      label: 'עמוד הבית',
      isActive: pathname.includes('/homepage'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      key: 'analytics',
      href: '/admin/analytics',
      label: 'אנליטיקה',
      isActive: pathname.includes('/analytics'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 2C2 1.44772 2.44772 1 3 1H17C17.5523 1 18 1.44772 18 2V18C18 18.5523 17.5523 19 17 19H3C2.44772 19 2 18.5523 2 18V2ZM4 3V17H16V3H4ZM6 5H8V15H6V5ZM10 7H12V15H10V7ZM14 9H16V15H14V9Z" />
        </svg>
      ),
    },
    {
      key: 'contact',
      href: '/admin/contact/contact-info',
      label: 'פרטי התקשרות',
      isActive: pathname.includes('/contact'),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" clipRule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <div className="brand" style={{ padding: '24px', textAlign: 'center', position: 'relative' }}>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          className="mobile-close-btn"
          style={{
            position: 'absolute',
            left: '16px',
            top: '24px',
            color: '#8c8c8c',
          }}
        />
        <span style={{ fontSize: '18px', fontWeight: 700, color: '#141414' }}>לוח ניהול</span>
      </div>
      
      <Menu
        theme="light"
        mode="inline"
        className="custom-sidenav"
        selectedKeys={[navItems.find(i => i.isActive)?.key || '']}
        style={{ border: 'none', background: 'transparent' }}
      >
        {navItems.map((item) => (
          <Menu.Item key={item.key} className="custom-menu-item">
            <Link href={item.href} className={`nav-item-wrapper ${item.isActive ? 'active' : ''}`}>
              <div
                className="icon-box"
                style={{
                  backgroundColor: item.isActive ? color : '#fff',
                  color: item.isActive ? '#fff' : '#8c8c8c',
                  boxShadow: item.isActive ? `0 4px 12px ${color}60` : '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                {item.icon}
              </div>
              <span className="label-text">{item.label}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>

      <style jsx global>{`
        /* Hide close button on desktop */
        .mobile-close-btn {
          display: none !important;
        }

        /* Show close button on mobile */
        @media (max-width: 991px) {
          .mobile-close-btn {
            display: inline-flex !important;
          }
        }

        /* Сброс стилей Ant Design, чтобы они не мешали */
        .custom-sidenav.ant-menu-inline {
          border-inline-end: none !important;
        }
        .custom-sidenav .ant-menu-item {
          height: auto !important;
          line-height: normal !important;
          padding: 0 16px !important;
          margin-bottom: 8px !important;
          background: transparent !important;
        }
        .custom-sidenav .ant-menu-item::after {
          display: none !important; /* Убираем полоску Ant Design справа */
        }
        .custom-sidenav .ant-menu-item-selected {
          background: transparent !important;
        }

        /* Твои новые стили */
        .nav-item-wrapper {
          display: flex;
          align-items: center;
          padding: 10px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
          text-decoration: none !important;
        }

        .nav-item-wrapper:hover {
          background-color: rgba(0, 0, 0, 0.04) !important;
        }

        .nav-item-wrapper.active {
          background-color: #fff !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        .icon-box {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          margin-left: 12px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .label-text {
          font-size: 14px;
          color: #8c8c8c;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .nav-item-wrapper.active .label-text {
          color: #141414 !important;
          font-weight: 700 !important;
        }
      `}</style>
    </>
  );
}