import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Тёмная тема отключена
  darkMode: 'class' as any,
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addVariant }: { addVariant: (name: string, definition: string) => void }) {
      // Принудительно только светлая тема — игнорируем системные dark-настройки
      addVariant('light', 'html:not(.dark) &')
    },
  ],
}

export default config
