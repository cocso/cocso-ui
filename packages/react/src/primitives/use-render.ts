import type { useRender as useRenderNS } from "@base-ui/react/use-render";

export { useRender } from "@base-ui/react/use-render";

/**
 * Public alias for the `render` prop type accepted by polymorphic components
 * (`Button`, `Link`, `Typography`, …). Re-exported so consumers can type their
 * own `render` values without importing from `@base-ui/react` directly.
 */
export type RenderProp = useRenderNS.RenderProp;
