import { VariableNamer } from "../variable-namer";
import { loadPackageJson } from "../../../util/load-package-json";

export class ImportTemplate extends VariableNamer {
  private _imports: { [key: string]: Set<string> } = {};
  private package: string = loadPackageJson().name;

  protected templateImports(): string {
    const importList: string[] = [];
    for (let pkg in this._imports) {
      importList.push(`import { ${this.getImports(pkg)} } from "${pkg}";\n`);
    }
    return importList.join("");
  }

  private getImports(pkg: string = this.package): string {
    return [...this._imports[pkg]].join(", ");
  }

  protected addImport(name: string, pkg: string = this.package) {
    if (this._imports[pkg] === undefined) {
      this._imports[pkg] = new Set([]);
    }
    this._imports[pkg].add(name);
  }
}
