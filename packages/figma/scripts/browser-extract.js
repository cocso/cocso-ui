/**
 * browser-extract.js
 *
 * Runs inside the browser via Playwright page.addScriptTag().
 * Plain JS — NOT processed by esbuild/tsx to avoid __name decorator issues.
 */

/** Parse a CSS color string to { r, g, b, a } with 0-1 range. */
function parseColor(raw) {
  if (!raw || raw === "transparent" || raw === "rgba(0, 0, 0, 0)") {
    return null;
  }
  const m = raw.match(
    /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/
  );
  if (m) {
    return {
      r: Number(m[1]) / 255,
      g: Number(m[2]) / 255,
      b: Number(m[3]) / 255,
      a: m[4] !== undefined ? Number(m[4]) : 1,
    };
  }
  return null;
}

/**
 * Parse CSS box-shadow into Figma-compatible effects AND border strokes.
 * Zero-offset, zero-blur shadows (e.g., "0 0 0 1px color") are treated
 * as border strokes rather than shadow effects, matching React's pattern
 * of using box-shadow for borders (Input, Select, OTP).
 */
function parseBoxShadow(raw) {
  if (!raw || raw === "none") {
    return { effects: [], borderStroke: null };
  }
  var effects = [];
  var borderStroke = null;
  var parts = raw.split(/,(?![^(]*\))/);
  for (var i = 0; i < parts.length; i++) {
    var trimmed = parts[i].trim();
    var isInset = trimmed.startsWith("inset");
    var values = trimmed.replace("inset", "").trim();
    var colorMatch = values.match(/rgba?\([^)]+\)/);
    var color = colorMatch
      ? parseColor(colorMatch[0])
      : { r: 0, g: 0, b: 0, a: 0.25 };
    if (!color) {
      continue;
    }
    var nums = values
      .replace(/rgba?\([^)]+\)/, "")
      .trim()
      .split(/\s+/)
      .map(parseFloat)
      .filter((n) => !isNaN(n));

    var offsetX = nums[0] || 0;
    var offsetY = nums[1] || 0;
    var blur = nums[2] || 0;
    var spread = nums[3] || 0;

    // Detect border-like shadow: 0 0 0 Npx (no offset, no blur, spread only)
    if (
      !isInset &&
      offsetX === 0 &&
      offsetY === 0 &&
      blur === 0 &&
      spread > 0
    ) {
      borderStroke = { color: color, weight: spread };
    } else {
      effects.push({
        type: isInset ? "INNER_SHADOW" : "DROP_SHADOW",
        color,
        offset: { x: offsetX, y: offsetY },
        radius: blur,
        spread: spread,
      });
    }
  }
  return { effects: effects, borderStroke: borderStroke };
}

/** Check if a node has any visual properties (fills, strokes, effects, radius). */
function hasVisualProperties(node) {
  return (
    (node.fills && node.fills.length > 0) ||
    node.strokes ||
    (node.effects && node.effects.length > 0) ||
    node.cornerRadius ||
    node.cornerRadii ||
    (node.opacity !== undefined && node.opacity < 1)
  );
}

/**
 * Flatten single-child wrapper nodes that have no visual properties.
 * Collapses patterns like FRAME(no-visual) → TEXT into just TEXT.
 */
function flattenNode(node) {
  if (node.type !== "FRAME" || !node.children) {
    return node;
  }

  // Recursively flatten children first
  node.children = node.children.map(flattenNode);

  // If single child with no visual properties on wrapper, promote child
  if (node.children.length === 1 && !hasVisualProperties(node)) {
    var child = node.children[0];
    // Preserve wrapper dimensions if child doesn't define its own
    if (child.width === undefined || child.width === 0) {
      child.width = node.width;
    }
    if (child.height === undefined || child.height === 0) {
      child.height = node.height;
    }
    // Merge padding from wrapper to child if child has no padding
    if (node.padding && !child.padding) {
      child.padding = node.padding;
    }
    return child;
  }

  return node;
}

/** Recursively extract a DOM element into a Figma-compatible spec. */
function extractNode(el) {
  var s = window.getComputedStyle(el);
  var rect = el.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return null;
  }

  var isText =
    el.children.length === 0 && (el.textContent || "").trim().length > 0;

  var node = {
    tag: el.tagName.toLowerCase(),
    width: Math.round(rect.width * 100) / 100,
    height: Math.round(rect.height * 100) / 100,
  };

  // Fills
  var bg = parseColor(s.backgroundColor);
  if (bg && bg.a > 0) {
    node.fills = [{ type: "SOLID", color: bg }];
  }

  // Strokes / CSS borders
  var bw = Number.parseFloat(s.borderWidth);
  if (bw > 0) {
    var bc = parseColor(s.borderColor);
    if (bc) {
      node.strokes = { color: bc, weight: bw };
    }
  }

  // Box shadow → effects + border strokes
  var shadowResult = parseBoxShadow(s.boxShadow);
  if (shadowResult.effects.length > 0) {
    node.effects = shadowResult.effects;
  }
  // Border-like shadow (0 0 0 Npx) → treat as stroke if no CSS border
  if (shadowResult.borderStroke && !node.strokes) {
    node.strokes = shadowResult.borderStroke;
  }

  // Border radius
  var br = [
    Number.parseFloat(s.borderTopLeftRadius),
    Number.parseFloat(s.borderTopRightRadius),
    Number.parseFloat(s.borderBottomRightRadius),
    Number.parseFloat(s.borderBottomLeftRadius),
  ];
  if (br.some((v) => v > 0)) {
    if (br[0] === br[1] && br[1] === br[2] && br[2] === br[3]) {
      node.cornerRadius = br[0];
    } else {
      node.cornerRadii = {
        topLeft: br[0],
        topRight: br[1],
        bottomRight: br[2],
        bottomLeft: br[3],
      };
    }
  }

  // Opacity
  var opacity = Number.parseFloat(s.opacity);
  if (opacity < 1) {
    node.opacity = opacity;
  }

  // Layout (flex)
  if (s.display.includes("flex")) {
    node.layoutMode = s.flexDirection === "column" ? "VERTICAL" : "HORIZONTAL";
    var gap = Number.parseFloat(s.gap);
    if (gap > 0) {
      node.itemSpacing = gap;
    }
    node.primaryAxisAlignItems =
      s.justifyContent === "center"
        ? "CENTER"
        : s.justifyContent === "flex-end"
          ? "MAX"
          : s.justifyContent === "space-between"
            ? "SPACE_BETWEEN"
            : "MIN";
    node.counterAxisAlignItems =
      s.alignItems === "center"
        ? "CENTER"
        : s.alignItems === "flex-end"
          ? "MAX"
          : "MIN";
  }

  // Padding
  var pt = Number.parseFloat(s.paddingTop);
  var pr = Number.parseFloat(s.paddingRight);
  var pb = Number.parseFloat(s.paddingBottom);
  var pl = Number.parseFloat(s.paddingLeft);
  if (pt > 0 || pr > 0 || pb > 0 || pl > 0) {
    node.padding = { top: pt, right: pr, bottom: pb, left: pl };
  }

  // Text properties
  if (isText) {
    node.type = "TEXT";
    node.text = (el.textContent || "").trim();
    node.fontSize = Number.parseFloat(s.fontSize);
    node.fontWeight = Number.parseInt(s.fontWeight, 10);
    node.fontFamily = s.fontFamily.split(",")[0].replace(/['"]/g, "").trim();
    var textColor = parseColor(s.color);
    if (textColor) {
      node.textColor = textColor;
    }
    var lh = Number.parseFloat(s.lineHeight);
    if (lh > 0) {
      node.lineHeight = lh;
    }
    if (s.textDecoration.includes("underline")) {
      node.textDecoration = "UNDERLINE";
    }
  } else {
    node.type = "FRAME";
    var children = [];
    for (var ci = 0; ci < el.children.length; ci++) {
      var child = el.children[ci];
      var childNode = extractNode(child);
      if (childNode) {
        var childRect = child.getBoundingClientRect();
        childNode.x = Math.round((childRect.left - rect.left) * 100) / 100;
        childNode.y = Math.round((childRect.top - rect.top) * 100) / 100;
        children.push(childNode);
      }
    }
    if (children.length > 0) {
      node.children = children;
    }
  }

  return node;
}

/** Main extraction: finds all data-component items and extracts specs. */
window.__extractComponents = () => {
  var items = document.querySelectorAll("[data-component]");
  var result = {};

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var component = item.getAttribute("data-component");
    var variantKey = item.getAttribute("data-variant-key") || "default";
    var target = item.firstElementChild;
    if (!target) {
      continue;
    }

    var spec = extractNode(target);
    // Flatten unnecessary single-child wrapper nesting
    if (spec) {
      spec = flattenNode(spec);
    }

    if (!result[component]) {
      result[component] = [];
    }
    result[component].push({ variantKey, spec: spec });
  }

  return result;
};
