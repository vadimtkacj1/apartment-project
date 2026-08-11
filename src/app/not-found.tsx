import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "דף לא נמצא | רם נכסים חיים ענבי",
  description: "הדף שחיפשת לא נמצא",
};

export default function NotFound() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "#faf7f2", color: "#171717" }}
    >
      <Header />
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center" dir="rtl">
          <p
            className="text-8xl font-bold mb-4"
            style={{ color: "#c9a96e", fontFamily: "var(--font-caramel, cursive)" }}
          >
            404
          </p>
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#171717" }}>
            אופס! הדף לא נמצא
          </h1>
          <p className="text-lg mb-8" style={{ color: "#666" }}>
            הדף שחיפשת אינו קיים או הועבר למיקום אחר.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "#c9a96e" }}
            >
              חזרה לדף הבית
            </Link>
            <Link
              href="/apartments"
              className="inline-block px-8 py-3 rounded-lg font-semibold transition-colors border-2"
              style={{ borderColor: "#c9a96e", color: "#c9a96e" }}
            >
              לחיפוש דירות
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
