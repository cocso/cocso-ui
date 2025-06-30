#!/usr/bin/env node

/**
 * @fileoverview
 * `@cocso-ui/baseframe`
 *
 * YAML 형식의 디자인 토큰을 CSS Variables와 JSON 형식으로 변환하는
 * 라이브러리와 CLI 도구를 제공합니다.
 */

export { BaseframeCore } from './core';
export type { Schema, BuildOptions, OutputFormat } from './core/schema';

export { runCli } from './cli';

export { loadTokenSchemas, loadCocsoBaseTokens, buildCssFile, buildJsonFile } from './core';

if (import.meta.main || process.argv[1] === new URL(import.meta.url).pathname) {
  const { runCli } = await import('./cli');
  runCli();
}
