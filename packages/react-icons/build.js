import esbuild from 'esbuild';
import pkg from './package.json' with { type: 'json' };
import fs from 'node:fs';
import path from 'node:path';

const sharedConfig = {
  bundle: true,
  write: true,
  treeShaking: true,
  minify: true,
  sourcemap: false,
  target: ['es2020'],
  external: [
    'react',
    'react-dom',
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  jsx: 'automatic',
  jsxImportSource: 'react',
};

const buildMainIndex = async () => {
  await esbuild.build({
    ...sharedConfig,
    entryPoints: ['./src/index.ts'],
    outfile: './lib/index.js',
    format: 'esm',
    platform: 'neutral',
  });

  await esbuild.build({
    ...sharedConfig,
    entryPoints: ['./src/index.ts'],
    outfile: './lib/index.cjs',
    format: 'cjs',
    platform: 'neutral',
  });
};

const buildIndividualComponents = async () => {
  const categories = ['brand', 'semantic', 'graphic'];

  for (const category of categories) {
    const categoryPath = `./src/components/${category}`;
    const libCategoryPath = `./lib/components/${category}`;

    if (!fs.existsSync(categoryPath)) continue;

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.tsx') && !file.startsWith('index'));

    for (const file of files) {
      const componentName = path.basename(file, '.tsx');
      const entryPoint = `${categoryPath}/${file}`;
      const outfile = `${libCategoryPath}/${componentName}.js`;

      await esbuild.build({
        ...sharedConfig,
        entryPoints: [entryPoint],
        outfile,
        format: 'esm',
        platform: 'neutral',
      });

      await esbuild.build({
        ...sharedConfig,
        entryPoints: [entryPoint],
        outfile: outfile.replace('.js', '.cjs'),
        format: 'cjs',
        platform: 'neutral',
      });
    }
  }
};

const buildCategoryIndexes = async () => {
  const categories = ['brand', 'semantic', 'graphic'];

  for (const category of categories) {
    const categoryPath = `./src/components/${category}`;
    const libCategoryPath = `./lib/components/${category}`;

    if (!fs.existsSync(categoryPath)) continue;

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.tsx') && !file.startsWith('index'));

    const exports = files
      .map((file) => {
        const componentName = path.basename(file, '.tsx');
        return `export { ${componentName} } from './${componentName}';`;
      })
      .join('\n');

    fs.writeFileSync(`${libCategoryPath}/index.js`, exports);
    fs.writeFileSync(`${libCategoryPath}/index.cjs`, exports);
  }
};

const build = async () => {
  try {
    await buildMainIndex();
    await buildIndividualComponents();
    await buildCategoryIndexes();
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
};

build();
