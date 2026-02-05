import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/admin" className="text-2xl font-bold">
              Admin Panel
            </Link>
          </div>

          <div className="hidden md:flex space-x-6">
            <Link
              href="/admin"
              className="hover:text-indigo-400 transition-colors"
            >
              Дашборд
            </Link>
            <Link
              href="/admin/apartments"
              className="hover:text-indigo-400 transition-colors"
            >
              Квартиры
            </Link>
            <Link
              href="/admin/users"
              className="hover:text-indigo-400 transition-colors"
            >
              Пользователи
            </Link>
            <Link
              href="/admin/settings"
              className="hover:text-indigo-400 transition-colors"
            >
              Настройки
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              На сайт
            </Link>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
              Выйти
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
