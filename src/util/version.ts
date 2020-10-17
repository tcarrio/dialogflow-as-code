import { loadPackageJson } from "./load-package-json";

export function getVersion(): string {
  return loadPackageJson().version;
}
