import Link from 'next/link';
import { getArticle } from '@/data/articles';

// Company line (Organization schema): +972-52-384-7291 — same number the
// articles hub CTA uses.
const WHATSAPP_PHONE = '972523847291';

interface ArticleCtaProps {
  /** Slug from src/data/articles.ts — used to prefill the WhatsApp message with the guide's title. */
  articleId: string;
}

/**
 * Shared end-of-article CTA band — appended after the FAQ in every guide.
 * Navy #051150 surface, WhatsApp (sky) + contact (white) actions, palette-only.
 */
export default function ArticleCta({ articleId }: ArticleCtaProps) {
  const title = getArticle(articleId)?.title ?? '';
  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
    `שלום, הגעתי מהמדריך "${title}" ואשמח לייעוץ`,
  )}`;

  return (
    <section
      dir="rtl"
      aria-label="יצירת קשר"
      className="mx-auto mt-6 max-w-[1000px] rounded-2xl bg-[#051150] px-6 py-10 text-center shadow-elev-2 md:px-10"
    >
      <h2 className="mb-3 text-2xl font-bold text-white md:text-3xl">
        נשארתם עם שאלה? דברו איתנו
      </h2>
      <p className="mx-auto mb-7 max-w-2xl text-lg leading-relaxed text-white/85">
        דניאל ויואב זמינים לכל שאלה על המדריך — בלי התחייבות ובגובה העיניים.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl bg-[#5594F1] px-7 py-3 font-bold text-white transition-colors hover:bg-[#354AC4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          וואטסאפ
        </a>
        <Link
          href="/#contact"
          className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 font-bold text-[#354AC4] transition-colors hover:bg-[#f5f7fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          צרו קשר
        </Link>
      </div>
    </section>
  );
}
