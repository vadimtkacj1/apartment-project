import Card from "@/components/ui/Card";

export default function AdminDashboard() {
  const stats = [
    { title: "Всего квартир", value: "156", change: "+12", icon: "🏠" },
    { title: "Активных бронирований", value: "45", change: "+5", icon: "📅" },
    { title: "Пользователей", value: "892", change: "+23", icon: "👥" },
    { title: "Доход за месяц", value: "₽ 2.5M", change: "+8%", icon: "💰" },
  ];

  const recentBookings = [
    { id: 1, apartment: "2-комн. на Ленина", user: "Иван Петров", date: "2026-02-05", status: "Подтверждено" },
    { id: 2, apartment: "Студия в центре", user: "Мария Сидорова", date: "2026-02-06", status: "Ожидание" },
    { id: 3, apartment: "3-комн. на Гагарина", user: "Петр Иванов", date: "2026-02-07", status: "Подтверждено" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Панель управления</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Последние бронирования</h2>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{booking.apartment}</p>
                  <p className="text-sm text-gray-600">{booking.user}</p>
                  <p className="text-sm text-gray-500">{booking.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === "Подтверждено"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Быстрые действия</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <div className="font-medium">Добавить новую квартиру</div>
              <div className="text-sm text-gray-600">Создать новое объявление</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <div className="font-medium">Просмотреть заявки</div>
              <div className="text-sm text-gray-600">5 новых заявок ожидают</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
              <div className="font-medium">Управление пользователями</div>
              <div className="text-sm text-gray-600">Добавить или редактировать</div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
