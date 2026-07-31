import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

// `vitest-axe` only augments the legacy `Vi` global namespace, which current
// Vitest no longer uses for `expect(...)`. Augment the module directly instead.
declare module "vitest" {
  interface Assertion<T = unknown> extends AxeMatchers {
    _assertionType?: T;
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
