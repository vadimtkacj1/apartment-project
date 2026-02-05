import Link from "next/link";

export default function AdminSidebar() {
  const menuItems = [
    { href: "/admin", label: "Дашборд", icon: "📊" },
    { href: "/admin/apartments", label: "Квартиры", icon: "🏠" },
    { href: "/admin/users", label: "Пользователи", icon: "👥" },
    { href: "/admin/bookings", label: "Бронирования", icon: "📅" },
    { href: "/admin/reviews", label: "Отзывы", icon: "⭐" },
    { href: "/admin/settings", label: "Настройки", icon: "⚙️" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
