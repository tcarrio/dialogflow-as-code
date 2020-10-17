/**
 * Lazily loads the package manifest from package.json, resolving to
 * default values to be used in the case an error occurs. In some cases
 * these may not be necessary so requiring a filesystem read on
 * start-up is likely too greedy.
 */

import { readFileSync } from "fs";
import { join } from "path";

const defaultManifest = { name: "@0xc/dialogflow-as-code", version: "‾\\_⪽⪾_/‾" };
let manifest: PackageManifest | null  = null;

export function loadPackageJson(): PackageManifest {
  if (manifest) {
    return manifest;
  }

  try {
    manifest = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), { encoding: "utf8" }))
  } finally {
    manifest = manifest ? manifest : defaultManifest;
  }

  return manifest;
}

export interface PackageManifest {
  name: string;
  version: string;
}