import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Контакты</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <h2 className="text-2xl font-semibold mb-4">Свяжитесь с нами</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="ivan@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сообщение
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Ваше сообщение..."
                ></textarea>
              </div>

              <Button type="submit" className="w-full">
                Отправить
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Адрес
              </h3>
              <p className="text-gray-600">
                Москва, ул. Примерная, 1<br />
                Офис 101
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                Телефон
              </h3>
              <p className="text-gray-600">
                +7 (999) 123-45-67<br />
                +7 (999) 765-43-21
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">📧</span>
                Email
              </h3>
              <p className="text-gray-600">
                info@apartment.com<br />
                support@apartment.com
              </p>
            </Card>

            <Card>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🕐</span>
                Часы работы
              </h3>
              <p className="text-gray-600">
                Пн-Пт: 9:00 - 19:00<br />
                Сб-Вс: 10:00 - 16:00
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
