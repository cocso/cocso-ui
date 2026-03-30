import path from "node:path";
import fs from "fs-extra";

const YAML_FILE_REGEX = /\.ya?ml$/;

export function findYamlFiles(dir: string): string[] {
  const files: string[] = [];
  function scan(current: string) {
    for (const item of fs.readdirSync(current)) {
      const full = path.join(current, item);
      if (fs.statSync(full).isDirectory()) {
        scan(full);
      } else if (YAML_FILE_REGEX.test(item)) {
        files.push(full);
      }
    }
  }
  scan(dir);
  return files.sort();
}
