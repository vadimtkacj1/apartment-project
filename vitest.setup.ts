// Global test setup.
//
// Keep the test console quiet: the route handlers and libs intentionally
// `console.error/.warn/.log` on expected error branches (bad input, upstream
// failures, etc.). Those are exercised on purpose by the suite, so silence them
// to keep the reporter readable. Re-applied in `beforeEach` because the config's
// `restoreMocks: true` resets spies after every test.
import { beforeEach, vi } from 'vitest';

// `revalidatePath` only works inside a Next request scope; the route tests call
// the handlers directly, so stub it here instead of in every suite.
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
}));

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});
