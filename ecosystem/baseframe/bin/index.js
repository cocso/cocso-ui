#!/usr/bin/env node
import { createRequire as me } from "node:module";
import T from "node:path";
import k from "fs-extra";
import ke from "yaml";
import he from "yargs";
function y(e, t) {
  return { tokens: X(e), collections: j(t) };
}
function j(e) {
  return e.data.map((t) => ({ name: t.name, modes: t.modes }));
}
function M(e) {
  const { collection: t, tokens: n } = e.data;
  return Object.entries(n).map(([r, o]) => {
    const s = Object.entries(o.values).map(([i, a]) => ({ mode: i, value: a }));
    return { token: { name: r, collection: t }, values: s };
  });
}
function X(e) {
  return e.flatMap(M);
}
var Y = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/,
  B = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/,
  H =
    /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*([01]?\.?\d*)\s*\)$/,
  W = /^\$[a-zA-Z0-9][a-zA-Z0-9_-]*(?:\.[a-zA-Z0-9][a-zA-Z0-9_-]*)+$/,
  Z = /^([+-]?\d*\.?\d+)(px|rem|em|vw|vh|%)$/,
  U = /^([+-]?\d*\.?\d+)(ms|s)$/,
  q = /\s+/;
function h(e) {
  const t = String(e).trim();
  if (typeof e == "number") {
    return { isValid: !0, value: { kind: "NumberValue", value: e } };
  }
  const n = E(t);
  if (n.isValid) {
    return n;
  }
  const r = N(t);
  if (r.isValid) {
    return r;
  }
  const o = D(t);
  if (o.isValid) {
    return o;
  }
  const s = w(t);
  if (s.isValid) {
    return s;
  }
  const i = Q(t);
  if (i.isValid) {
    return i;
  }
  const a = L(t);
  if (a.isValid) {
    return a;
  }
  const l = K(t);
  return l.isValid
    ? l
    : { isValid: !0, value: { kind: "StringValue", value: t } };
}
function f(e) {
  switch (e.kind) {
    case "HexColor":
      return e.value;
    case "RgbColor":
      return `rgb(${e.r}, ${e.g}, ${e.b})`;
    case "RgbaColor":
      return `rgba(${e.r}, ${e.g}, ${e.b}, ${e.a})`;
    case "TokenRef":
      return `$${e.collection}.${e.token}`;
    case "SizeValue":
      return `${e.value}${e.unit}`;
    case "DurationValue":
      return `${e.value}${e.unit}`;
    case "NumberValue":
      return e.value.toString();
    case "StringValue":
      return e.value;
    case "ShadowLayer": {
      const t = f(e.offsetX),
        n = f(e.offsetY),
        r = f(e.blur),
        o = f(e.spread),
        s = f(e.color);
      return `${t} ${n} ${r} ${o} ${s}`;
    }
    case "Shadow":
      return e.layers.map((t) => f(t)).join(", ");
    default:
      return String(e);
  }
}
function E(e) {
  return Y.test(e)
    ? { isValid: !0, value: { kind: "HexColor", value: e } }
    : { isValid: !1, error: `Invalid hex color: ${e}` };
}
function N(e) {
  const t = e.match(B);
  if (!t) {
    return { isValid: !1, error: `Invalid rgb color: ${e}` };
  }
  const [, n, r, o] = t,
    s = Number.parseInt(n, 10),
    i = Number.parseInt(r, 10),
    a = Number.parseInt(o, 10);
  return s < 0 || s > 255 || i < 0 || i > 255 || a < 0 || a > 255
    ? { isValid: !1, error: `Invalid RGB values: ${e}` }
    : { isValid: !0, value: { kind: "RgbColor", r: s, g: i, b: a } };
}
function D(e) {
  const t = e.match(H);
  if (!t) {
    return { isValid: !1, error: `Invalid rgba color: ${e}` };
  }
  const [, n, r, o, s] = t,
    i = Number.parseInt(n, 10),
    a = Number.parseInt(r, 10),
    l = Number.parseInt(o, 10),
    c = Number.parseFloat(s);
  return i < 0 || i > 255 || a < 0 || a > 255 || l < 0 || l > 255
    ? { isValid: !1, error: `Invalid RGB values: ${e}` }
    : c < 0 || c > 1
      ? { isValid: !1, error: `Invalid alpha value: ${e}` }
      : { isValid: !0, value: { kind: "RgbaColor", r: i, g: a, b: l, a: c } };
}
function w(e) {
  if (!W.test(e)) {
    return { isValid: !1, error: `Invalid token reference: ${e}` };
  }
  const n = e.substring(1).split(".");
  if (n.length < 2) {
    return { isValid: !1, error: `Invalid token format: ${e}` };
  }
  const r = n.at(-1);
  return {
    isValid: !0,
    value: { kind: "TokenRef", collection: n.slice(0, -1).join("."), token: r },
  };
}
function L(e) {
  const t = e.match(Z);
  if (!t) {
    return { isValid: !1, error: `Invalid size: ${e}` };
  }
  const [, n, r] = t,
    o = Number.parseFloat(n);
  return Number.isNaN(o)
    ? { isValid: !1, error: `Invalid size value: ${e}` }
    : { isValid: !0, value: { kind: "SizeValue", value: o, unit: r } };
}
function K(e) {
  const t = e.match(U);
  if (!t) {
    return { isValid: !1, error: `Invalid duration: ${e}` };
  }
  const [, n, r] = t,
    o = Number.parseFloat(n);
  return Number.isNaN(o)
    ? { isValid: !1, error: `Invalid duration value: ${e}` }
    : { isValid: !0, value: { kind: "DurationValue", value: o, unit: r } };
}
function J(e) {
  if (!e) {
    return { isValid: !1, error: "Missing color value" };
  }
  if (e.startsWith("$")) {
    return w(e);
  }
  if (e.startsWith("var(")) {
    return { isValid: !0, value: { kind: "StringValue", value: e } };
  }
  const t = E(e);
  if (t.isValid) {
    return t;
  }
  const n = N(e);
  if (n.isValid) {
    return n;
  }
  const r = D(e);
  return r.isValid ? r : { isValid: !1, error: `Invalid color: ${e}` };
}
function Q(e) {
  if (!(e.includes("px") || e.includes("$"))) {
    return { isValid: !1, error: `Invalid shadow format: ${e}` };
  }
  try {
    const t = e.split(",").map((r) => r.trim()),
      n = [];
    for (const r of t) {
      const o = ee(r);
      if (!(o.isValid && o.value)) {
        return { isValid: !1, error: `Invalid shadow layer: ${r}` };
      }
      n.push(o.value);
    }
    return { isValid: !0, value: { kind: "Shadow", layers: n } };
  } catch {
    return { isValid: !1, error: `Invalid shadow format: ${e}` };
  }
}
function ee(e) {
  const t = e.trim().split(q);
  if (t.length < 4) {
    return { isValid: !1, error: `Invalid shadow layer format: ${e}` };
  }
  try {
    const n = v(t[0]),
      r = v(t[1]),
      o = v(t[2]),
      s = v(t[3]);
    if (!(n.isValid && r.isValid && o.isValid && s.isValid)) {
      return { isValid: !1, error: `Invalid shadow dimensions: ${e}` };
    }
    const i = t.slice(4).join(" ").trim(),
      a = J(i);
    return a.isValid
      ? {
          isValid: !0,
          value: {
            kind: "ShadowLayer",
            color: a.value,
            offsetX: n.value,
            offsetY: r.value,
            blur: o.value,
            spread: s.value,
          },
        }
      : { isValid: !1, error: `Invalid shadow color: ${i}` };
  } catch {
    return { isValid: !1, error: `Invalid shadow layer: ${e}` };
  }
}
function v(e) {
  return e.startsWith("$") ? w(e) : L(e);
}
function te(e) {
  return h(e);
}
function ne(e) {
  const t = [];
  for (const n of e) {
    for (const r of n.values) {
      const o = te(r.value);
      t.push({
        tokenName: n.token.name,
        collection: n.token.collection,
        mode: r.mode,
        value: r.value,
        result: o,
      });
    }
  }
  return t;
}
function g(e) {
  const t = [];
  if (e.kind === "TokenRef") {
    t.push({ collection: e.collection, token: e.token });
  } else if (e.kind === "ShadowLayer") {
    t.push(...g(e.color)),
      t.push(...g(e.offsetX)),
      t.push(...g(e.offsetY)),
      t.push(...g(e.blur)),
      t.push(...g(e.spread));
  } else if (e.kind === "Shadow") {
    for (const n of e.layers) {
      t.push(...g(n));
    }
  }
  return t;
}
function re(e, t) {
  const n = [],
    r = [],
    o = e.data.collection,
    s = t.get(o);
  if (!s) {
    return (
      n.push({
        type: "INVALID_COLLECTION",
        message: `Collection '${o}' is not defined`,
        collection: o,
      }),
      { isValid: !1, errors: n, warnings: r }
    );
  }
  for (const [i, a] of Object.entries(e.data.tokens)) {
    const l = Object.keys(a.values),
      c = s.modes.filter((u) => !l.includes(u));
    c.length > 0 &&
      n.push({
        type: "MISSING_MODE",
        message: `Token '${i}' is missing modes: ${c.join(", ")}`,
        tokenName: i,
        collection: o,
      });
    for (const [u, d] of Object.entries(a.values)) {
      const p = h(d);
      p.isValid ||
        n.push({
          type: "INVALID_VALUE_FORMAT",
          message:
            p.error || `Invalid value format for token '${i}' in mode '${u}'`,
          tokenName: i,
          collection: o,
          mode: u,
          value: d,
        });
    }
  }
  return { isValid: n.length === 0, errors: n, warnings: r };
}
function oe(e, t) {
  const n = [],
    r = [],
    o = ne(e);
  for (const {
    tokenName: s,
    collection: i,
    mode: a,
    value: l,
    result: c,
  } of o) {
    if (!c.isValid) {
      n.push({
        type: "INVALID_VALUE_FORMAT",
        message: c.error || "Invalid value format",
        tokenName: s,
        collection: i,
        mode: a,
        value: l,
      });
      continue;
    }
    if (c.value) {
      const u = g(c.value);
      for (const { collection: d, token: p } of u) {
        const I = `$${d}.${p}`;
        t.find((F) => F.token.name === I) ||
          n.push({
            type: "INVALID_PRIMITIVE_TOKEN",
            message: `Referenced token '${I}' not found`,
            tokenName: s,
            collection: i,
            mode: a,
            value: l,
          });
      }
    }
  }
  return { isValid: n.length === 0, errors: n, warnings: r };
}
function O(e, t) {
  const n = [],
    r = [];
  for (const a of e) {
    const l = re(a, t);
    n.push(...l.errors), r.push(...l.warnings);
  }
  const o = {
      kind: "TokenCollections",
      metadata: { id: "temp", name: "temp" },
      data: Array.from(t.values()),
    },
    s = y(e, o),
    i = oe(s.tokens, s.tokens);
  return (
    n.push(...i.errors),
    r.push(...i.warnings),
    { isValid: n.length === 0, errors: n, warnings: r }
  );
}
function b(e, t) {
  const n = new Map(t.data.map((o) => [o.name, o])),
    r = O(e, n);
  if (!r.isValid) {
    console.error("Token validation failed:");
    for (const o of r.errors) {
      console.error(`  ${o.message}`);
    }
    throw new Error("Token validation failed. Please fix the errors above.");
  }
  if (r.warnings.length > 0) {
    console.warn("Token validation warnings:");
    for (const o of r.warnings) {
      console.warn(`  ${o}`);
    }
  }
  return y(e, t);
}
function R(e, t, n) {
  return {
    resolve(r) {
      return m(r, e, t, n);
    },
    resolveTokenRef(r) {
      const o = `$${r.collection}.${r.token}`;
      if (!e.find((a) => a.token.name === o)) {
        throw new Error(`Token not found: ${o}`);
      }
      return `var(${n(o)})`;
    },
  };
}
function m(e, t, n, r) {
  switch (e.kind) {
    case "TokenRef": {
      const o = `$${e.collection}.${e.token}`;
      if (!t.find((a) => a.token.name === o)) {
        throw new Error(`Token not found: ${o}`);
      }
      return { kind: "StringValue", value: `var(${r(o)})` };
    }
    case "ShadowLayer":
      return {
        kind: "ShadowLayer",
        color: m(e.color, t, n, r),
        offsetX: m(e.offsetX, t, n, r),
        offsetY: m(e.offsetY, t, n, r),
        blur: m(e.blur, t, n, r),
        spread: m(e.spread, t, n, r),
      };
    case "Shadow":
      return { kind: "Shadow", layers: e.layers.map((o) => m(o, t, n, r)) };
    default:
      return e;
  }
}
function V(e) {
  return typeof e == "string" ? e : typeof e == "number" ? e.toString() : f(e);
}
function $(e, t, n, r) {
  const o = String(e);
  if (!o.startsWith("$")) {
    const a = h(o);
    if (a.isValid && a.value) {
      const c = R(t, "default", (u) => n(u, r)).resolve(a.value);
      return V(c);
    }
    return e;
  }
  const s = h(o);
  if (!(s.isValid && s.value)) {
    throw new Error(`Invalid token reference: ${o}`);
  }
  return R(t, "default", (a) => n(a, r)).resolveTokenRef(s.value);
}
var se = /^\$/,
  ie = /\./g;
function x(e, t) {
  const n = e.replace(se, "").replace(ie, "-");
  return t ? `--${t}-${n}` : `--${n}`;
}
function ae(e, t, n, r) {
  const o = e.values.find((a) => a.mode === t);
  if (!o) {
    throw new Error(
      `No value found for token '${e.token.name}' in mode '${t}'`
    );
  }
  const s = $(o.value, n, x, r);
  return `${x(e.token.name, r)}: ${V(s)};`;
}
function le(e, t, n, r, o) {
  const s = t
    .map((i) => `  ${ae(i, n, r, o)}`)
    .join(`
`);
  return `${e} {
${s}
}`;
}
function P(e, t) {
  const { prefix: n, banner: r = "", selectors: o = {} } = t,
    { tokens: s, collections: i } = e,
    a = i
      .flatMap((l) => {
        const c = s.filter((u) => u.token.collection === l.name);
        return l.modes.map((u) => {
          var p;
          const d = ((p = o[l.name]) == null ? void 0 : p[u]) || ":root";
          return le(d, c, u, s, n);
        });
      })
      .join(`

`);
  return `${r}${a}`;
}
function ce(e, t, n = {}) {
  const r = b(e, t);
  return P(r, n);
}
var S = { generateCssVariables: ce, generateFromAst: P, createVarName: x };
var ue = /^\$/,
  de = /\./g;
function C(e, t) {
  const n = e.replace(ue, "").replace(de, "-");
  return t ? `--${t}-${n}` : `--${n}`;
}
function fe(e, t, n) {
  const { prefix: r } = n,
    o = [],
    s = new Set();
  for (const i of e) {
    if (s.has(i.token.name)) {
      continue;
    }
    s.add(i.token.name);
    const a = i.values.find((d) => d.mode === t);
    if (!a) {
      continue;
    }
    const l = $(a.value, e, C, r),
      c = V(l);
    i.token.name === "$number.1" && o.push(`  --spacing: ${c};`);
    const u = C(i.token.name, r);
    o.push(`  ${u}: ${c};`);
  }
  return o.length > 0
    ? `@theme {
${o.join(`
`)}
}`
    : "";
}
function pe() {
  return [
    "@utility bg-* { background-color: --value(--color-*); }",
    "@utility text-* { color: --value(--color-*); }",
    "@utility border-* { border-color: --value(--color-*); }",
    "@utility fill-* { fill: --value(--color-*); }",
    "@utility stroke-* { stroke: --value(--color-*); }",
    "@utility p-* { padding: --value(--spacing-*); }",
    "@utility px-* { padding-left: --value(--spacing-*); padding-right: --value(--spacing-*); }",
    "@utility py-* { padding-top: --value(--spacing-*); padding-bottom: --value(--spacing-*); }",
    "@utility pt-* { padding-top: --value(--spacing-*); }",
    "@utility pr-* { padding-right: --value(--spacing-*); }",
    "@utility pb-* { padding-bottom: --value(--spacing-*); }",
    "@utility pl-* { padding-left: --value(--spacing-*); }",
    "@utility m-* { margin: --value(--spacing-*); }",
    "@utility mx-* { margin-left: --value(--spacing-*); margin-right: --value(--spacing-*); }",
    "@utility my-* { margin-top: --value(--spacing-*); margin-bottom: --value(--spacing-*); }",
    "@utility mt-* { margin-top: --value(--spacing-*); }",
    "@utility mr-* { margin-right: --value(--spacing-*); }",
    "@utility mb-* { margin-bottom: --value(--spacing-*); }",
    "@utility ml-* { margin-left: --value(--spacing-*); }",
    "@utility w-* { width: --value(--spacing-*); }",
    "@utility h-* { height: --value(--spacing-*); }",
    "@utility min-w-* { min-width: --value(--spacing-*); }",
    "@utility min-h-* { min-height: --value(--spacing-*); }",
    "@utility max-w-* { max-width: --value(--spacing-*); }",
    "@utility max-h-* { max-height: --value(--spacing-*); }",
    "@utility gap-* { gap: --value(--spacing-*); }",
    "@utility space-x-* { & > :not(:last-child) { --tw-space-x-reverse: 0; margin-inline-start: calc(--value(--spacing-*) * var(--tw-space-x-reverse)); margin-inline-end: calc(--value(--spacing-*) * calc(1 - var(--tw-space-x-reverse))); } }",
    "@utility space-y-* { & > :not(:last-child) { --tw-space-y-reverse: 0; margin-block-start: calc(--value(--spacing-*) * var(--tw-space-y-reverse)); margin-block-end: calc(--value(--spacing-*) * calc(1 - var(--tw-space-y-reverse))); } }",
    "@utility space-x-reverse { & > :not(:last-child) { --tw-space-x-reverse: 1; } }",
    "@utility space-y-reverse { & > :not(:last-child) { --tw-space-y-reverse: 1; } }",
    "@utility rounded-* { border-radius: --value(--spacing-*); }",
    "@utility font-* { font-weight: --value(--font-weight-*); }",
    "@utility tracking-* { letter-spacing: --value(--tracking-*); }",
    "@utility shadow-* { box-shadow: --value(--shadow-*); }",
    "@utility border-width-* { border-width: --value(--border-width-*); }",
    "@utility z-* { z-index: --value(--z-index-*); }",
  ];
}
function z(e, t) {
  const { banner: n = "" } = t,
    { tokens: r, collections: o } = e,
    s = [];
  n && s.push(n);
  for (const a of o) {
    const l = r.filter((c) => c.token.collection === a.name);
    for (const c of a.modes) {
      const u = fe(l, c, t);
      u && (s.push(u), s.push(""));
    }
  }
  const i = pe();
  return (
    i.length > 0 && (s.push(...i), s.push("")),
    s.join(`
`)
  );
}
function ge(e, t, n = {}) {
  const r = b(e, t);
  return z(r, n);
}
var A = { generateTailwindCSS: ge, generateFromAst: z, createVarName: C };
var Ve = /\.ya?ml$/,
  ye = me(import.meta.url),
  ve = ye.resolve("@cocso-ui/baseframe-sources"),
  be = T.dirname(ve);
function _() {
  process.stdout.write(`
\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2554\u2588\u2588\u2588\u2588\u2554\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2557
\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551\u2588\u2588\u2551\u255A\u2588\u2588\u2554\u255D\u2588\u2588\u2551\u2588\u2588\u2554\u2550\u2550\u255D
\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\u2588\u2588\u2551     \u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551  \u2588\u2588\u2551\u2588\u2588\u2551 \u255A\u2550\u255D \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557
\u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\u255A\u2550\u255D     \u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D  \u255A\u2550\u255D\u255A\u2550\u255D     \u255A\u2550\u255D\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D
`);
}
function $e(e) {
  const t = [];
  function n(r) {
    const o = k.readdirSync(r);
    for (const s of o) {
      const i = T.join(r, s),
        a = k.statSync(i);
      a.isDirectory() ? n(i) : a.isFile() && Ve.test(s) && t.push(i);
    }
  }
  return n(e), t;
}
function G() {
  let e = $e(be),
    t = [],
    n = null;
  for (const r of e) {
    try {
      const o = k.readFileSync(r, "utf-8"),
        s = ke.parse(o);
      s.kind === "Tokens"
        ? t.push(s)
        : s.kind === "TokenCollections" && (n = s);
    } catch (o) {
      console.warn(` \u274E failed to parse ${r}:`, o);
    }
  }
  return (
    n || (console.error(" \u274E collections.yaml not found"), process.exit(1)),
    { tokens: t, collections: n }
  );
}
function Te(e, t) {
  const { tokens: n, collections: r } = G(),
    o = S.generateCssVariables(n, r, {
      prefix: t,
      banner: "",
      selectors: { global: { default: ":root" } },
    });
  k.ensureDirSync(e);
  const s = T.join(e, "token.css");
  k.writeFileSync(s, o, "utf-8"),
    console.log(` \u2705 Generated CSS variables: ${s}`);
}
function we(e, t) {
  const { tokens: n, collections: r } = G(),
    o = A.generateTailwindCSS(n, r, { prefix: t, banner: "" });
  k.ensureDirSync(e);
  const s = T.join(e, "tailwind4.css");
  k.writeFileSync(s, o, "utf-8"),
    console.log(` \u2705 Generated TailwindCSS 4.0 configuration: ${s}`);
}
he(process.argv.slice(2))
  .command(
    "css-vars [dir] [prefix]",
    "Generate CSS variables",
    (e) =>
      e
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./dist/",
        })
        .option("prefix", { describe: "CSS variable prefix", type: "string" }),
    (e) => {
      _(), Te(e.dir, e.prefix);
    }
  )
  .command(
    "tailwindcss [dir] [prefix]",
    "Generate TailwindCSS 4.0 configuration",
    (e) =>
      e
        .positional("dir", {
          describe: "Output directory",
          type: "string",
          default: "./dist/",
        })
        .option("prefix", { describe: "CSS variable prefix", type: "string" }),
    (e) => {
      _(), we(e.dir, e.prefix);
    }
  )
  .demandCommand(1, "You need to specify a command.")
  .showHelpOnFail(!0)
  .help().argv;
