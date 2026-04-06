/** @type {import('svgo').Config} */
export default {
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          // Keep viewBox — icons rely on it for sizing
          removeViewBox: false,
          // Keep clipPath/gradient elements used by brand icons
          removeHiddenElems: false,
          // Do not merge paths in brand icons — visual fidelity
          mergePaths: false,
          // Keep fill="none" — intentional in stroke-based icons
          removeEmptyAttrs: false,
          // Keep IDs for clipPath/gradient references
          cleanupIds: false,
        },
      },
    },
    "removeXMLProcInst",
    "removeDoctype",
    "removeMetadata",
    "removeComments",
  ],
};
