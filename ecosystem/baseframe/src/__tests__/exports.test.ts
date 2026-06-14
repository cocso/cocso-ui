import { describe, expect, it } from "vitest";
import {
  buildAst as coreBuildAst,
  buildValidatedAst as coreBuildValidatedAst,
  parseValue as coreParseValue,
  validateAllTokens as coreValidateAllTokens,
} from "../core";
import { cssVars, tailwind } from "../core/builders";
import {
  createVarName,
  resolveValueWithResolver,
  toCssValue,
} from "../core/builders/utils";
import { buildAst, valueToString } from "../core/parsers";
import { createTokenResolver, validateAllTokens } from "../core/transforms";

describe("module exports", () => {
  it("re-exports builders entry points", () => {
    expect(cssVars).toBeDefined();
    expect(tailwind).toBeDefined();
  });

  it("re-exports parser and transform helpers from core", () => {
    expect(coreBuildAst).toBeDefined();
    expect(coreBuildValidatedAst).toBeDefined();
    expect(coreValidateAllTokens).toBeDefined();
    expect(coreParseValue).toBeDefined();
  });

  it("re-exports utility helpers", () => {
    expect(createVarName).toBeDefined();
    expect(toCssValue).toBeDefined();
    expect(resolveValueWithResolver).toBeDefined();
  });

  it("re-exports parser and transform modules", () => {
    expect(buildAst).toBeDefined();
    expect(valueToString).toBeDefined();
    expect(createTokenResolver).toBeDefined();
    expect(validateAllTokens).toBeDefined();
  });
});
