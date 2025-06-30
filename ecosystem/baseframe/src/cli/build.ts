import { BaseframeCore } from '../core';
import type { CliArgs } from './options';
import { DEFAULT_PATTERNS, DEFAULT_OUTPUT_DIR } from './options';

/**
 * Execute build command
 */
export const executeBuildCommand = async (args: CliArgs): Promise<void> => {
  const inputPattern = args.inputPattern || DEFAULT_PATTERNS.join(',');
  const outputDir = args.outputDir || DEFAULT_OUTPUT_DIR;
  const formats = args.formats || ['css', 'json'];
  const { verbose = false, individual = true } = args;

  console.log('Starting token build...');

  if (verbose) {
    console.log(`Input pattern: ${inputPattern}`);
    console.log(`Output directory: ${outputDir}`);
    console.log(`Output formats: ${formats.join(', ')}`);
    console.log(`Build mode: ${individual ? 'individual' : 'combined'}`);
  }

  const core = new BaseframeCore();

  try {
    const patterns = inputPattern.split(',').map((p) => p.trim());
    await core.loadSchemas(patterns);

    if (verbose) console.log('Loading COCSO base tokens...');
    await core.loadCocsoTokens();

    const schemas = core.getSchemas();

    if (schemas.length === 0) {
      console.log('No valid token schemas found');
      return;
    }

    if (verbose) {
      const stats = core.getSchemaStats();
      console.log(`Loaded schemas: ${schemas.length}`);
      Object.entries(stats).forEach(([kind, count]) => {
        console.log(`   - ${kind}: ${count}`);
      });
    }

    const builtFiles = await core.buildMultiple(outputDir, { formats, individual });

    console.log('Token build completed successfully!');

    if (individual) {
      console.log(`Generated ${builtFiles.length} individual files:`);
    } else {
      console.log('Generated files:');
    }

    builtFiles.forEach((file) => {
      console.log(`   ${file}`);
    });
  } catch (error) {
    console.error('Build error occurred:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
