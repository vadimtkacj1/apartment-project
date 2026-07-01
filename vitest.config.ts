import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const srcDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(srcDir, './src'),
    },
  },
  test: {
    globals: true,
    // Default to a fast Node environment. Files that need a DOM (React hooks /
    // components) opt in per-file with `// @vitest-environment jsdom`.
    environment: 'node',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      // Report on the logic layer the suite targets (libs, data helpers, the
      // property-mapping hook, and API route handlers). Static content / layout
      // React components are intentionally out of scope — they carry no branch
      // logic worth asserting.
      include: [
        'src/lib/**/*.ts',
        'src/data/cities.ts',
        'src/data/articles.ts',
        'src/hooks/usePropertyData.ts',
        'src/app/api/**/*.ts',
      ],
      exclude: [
        '**/__tests__/**',
        'src/lib/prisma.ts', // thin PrismaClient bootstrap; mocked everywhere
        'src/app/api/auth/[...nextauth]/route.ts', // next-auth handler wiring
      ],
      reporter: ['text-summary', 'text'],
    },
  },
});
