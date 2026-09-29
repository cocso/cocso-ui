/**
 * Stylesheets imported for their side effects.
 *
 * `preview.ts` loads the token and component CSS the way a consumer does, and
 * `noUncheckedSideEffectImports` asks for a declaration before it will accept an
 * import that contributes no types. Vite resolves these; TypeScript only needs
 * to be told they exist.
 */
declare module "*.css";
