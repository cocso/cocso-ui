"use strict";
const babel = require("@rollup/plugin-babel");
const babelPresetReact = require("@babel/preset-react");
const babelPresetTypescript = require("@babel/preset-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const postcss = require("rollup-plugin-postcss");
const preserveDirectives = require("rollup-plugin-preserve-directives");
const dts = require("rollup-plugin-dts").default;
const path = require("node:path");

const packageJSON = require(path.join(process.cwd(), "package.json"));

const extensions = [".js", ".jsx", ".ts", ".tsx"];

function external(pkg) {
  const externals = Object.keys({
    ...packageJSON.dependencies,
    ...packageJSON.peerDependencies,
  });
  return externals.some((externalPkg) => {
    return pkg.startsWith(externalPkg);
  });
}

function onwarn(warning, warn) {
  if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
    return;
  }
  warn(warning);
}

function buildJS(format, input, output) {
  const isESM = format === "esm";
  return {
    input,
    external,
    onwarn,
    output: [
      {
        format,
        dir: output,
        entryFileNames: `[name].${isESM ? "mjs" : "js"}`,
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    ],
    plugins: [
      postcss({
        autoModules: true,
        minimize: true,
        extract: isESM,
      }),
      resolve({ extensions }),
      isESM && commonjs(),
      babel({
        extensions,
        babelHelpers: "bundled",
        presets: [
          [babelPresetReact, { runtime: "automatic" }],
          babelPresetTypescript,
        ],
      }),
      preserveDirectives.default(),
    ].filter(Boolean),
  };
}

function buildDTS(format, input, output) {
  const isESM = format === "esm";
  return {
    input,
    // Declarations never carry styles. The JS builds hand CSS to postcss; this
    // one has no such plugin, so a stylesheet reaches the parser as source and
    // fails on its first selector. A component that binds one (`import styles
    // from "./x.module.css"`) is covered by the ambient declaration; a
    // stylesheet imported for its own sake — the pickers share two — is not.
    external: (id, ...rest) => id.endsWith(".css") || external(id, ...rest),
    onwarn,
    output: [
      {
        format,
        dir: output,
        entryFileNames: `[name].${isESM ? "d.mts" : "d.ts"}`,
        preserveModules: true,
        preserveModulesRoot: "src",
      },
    ],
    plugins: [dts()],
  };
}

module.exports = [
  buildJS("cjs", "src/index.ts", "dist/cjs"),
  buildJS("esm", "src/index.ts", "dist/esm"),
  buildDTS("cjs", "src/index.ts", "dist/cjs"),
  buildDTS("esm", "src/index.ts", "dist/esm"),
];
