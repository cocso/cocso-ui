import { BaseframeCore } from '../core';
import type { CliArgs } from './options';
import { DEFAULT_PATTERNS } from './options';

export const executeValidateCommand = async (args: CliArgs): Promise<void> => {
  const inputPattern = args.inputPattern || DEFAULT_PATTERNS.join(',');
  const { verbose = false } = args;

  console.log('Starting token validation...');

  if (verbose) {
    console.log(`Input pattern: ${inputPattern}`);
  }

  const core = new BaseframeCore();

  try {
    const patterns = inputPattern.split(',').map((p) => p.trim());
    await core.loadSchemas(patterns);

    if (verbose) console.log('Loading COCSO base tokens...');
    await core.loadCocsoTokens();

    const schemas = core.getSchemas();

    if (schemas.length === 0) {
      console.log('No token schemas found for validation');
      return;
    }

    const stats = core.getSchemaStats();
    console.log(`Validation completed: ${schemas.length} schemas`);

    Object.entries(stats).forEach(([kind, count]) => {
      console.log(`   - ${kind}: ${count}`);
    });

    if (verbose) {
      console.log('\nDetailed information:');
      schemas.forEach((schema, index) => {
        console.log(`${index + 1}. ${schema.metadata.name} (${schema.kind})`);
        if (schema.metadata.description) {
          console.log(`   Description: ${schema.metadata.description}`);
        }
        console.log(`   Token count: ${Object.keys(schema.data.tokens || {}).length}`);
      });
    }

    console.log('All tokens are valid!');
  } catch (error) {
    console.error('Validation error occurred:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
};
