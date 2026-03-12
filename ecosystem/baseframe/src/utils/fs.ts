import path from "node:path";
import fs from "fs-extra";

const YAML_FILE_REGEX = /\.ya?ml$/;

/**
 * Recursively finds all YAML files (`.yml` or `.yaml`) under the given directory.
 *
 * Performs a depth-first traversal and returns the absolute paths of every
 * matching file in the order they are encountered.
 *
 * @param dir - Root directory to search.
 * @returns Array of absolute file paths for all discovered YAML files.
 */
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
  return files;
}
