import fs from 'fs';
import path from 'path';

function generateIndexFiles() {
  const componentsDir = './src/components';

  if (!fs.existsSync(componentsDir)) {
    console.log(`Directory ${componentsDir} does not exist, skipping...`);
    return;
  }

  const subdirs = fs
    .readdirSync(componentsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  if (subdirs.length === 0) {
    console.log(`No subdirectories found in ${componentsDir}`);
    return;
  }

  subdirs.forEach((subdir) => {
    const subdirPath = path.join(componentsDir, subdir);
    const indexPath = path.join(subdirPath, 'index.ts');

    const files = fs
      .readdirSync(subdirPath)
      .filter((file) => file.endsWith('.tsx'))
      .map((file) => file.replace('.tsx', ''))
      .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

    if (files.length === 0) {
      console.log(`No .tsx files found in ${subdirPath}`);
      return;
    }

    const exportStatements = files.map((file) => `export * from './${file}';`).join('\n');
    fs.writeFileSync(indexPath, `${exportStatements}\n`);

    console.log(`Generated ${indexPath} with ${files.length} exports:`, files);
  });

  const srcIndexPath = './src/index.ts';
  const srcIndexExports = subdirs
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((subdir) => `export * from './components/${subdir}';`)
    .join('\n');
  fs.writeFileSync(srcIndexPath, `${srcIndexExports}\n`);

  console.log(`Generated ${srcIndexPath} with exports from:`, subdirs);
}

generateIndexFiles();
