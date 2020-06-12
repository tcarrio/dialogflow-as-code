import { varName } from "../common";

export class VariableNamer {
  private _name: string = "";
  public constructor(name: string, prefix: string = "") {
    if (name) {
      this.setVariableName(name, prefix);
    }
  }
  protected setVariableName(name: string, prefix: string) {
    this._name = varName(name, prefix);
  }
  public templateVariableName(): string {
    return this._name;
  }
}
