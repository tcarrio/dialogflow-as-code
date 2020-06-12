import _ from "lodash";

let definedVariables: { [key: string]: string } = {};
let createdVariables: Set<string> = new Set([]);

export const varName = (name: string, prefix: string = "") => {
  const vn = _.camelCase(`${prefix}${name}`);
  definedVariables[name] = vn;
  createdVariables.add(vn);
  return vn;
};

export function getVars(): string[] {
  return [...createdVariables];
}

export function getVar(name: string): string | null {
  if (definedVariables[name] !== undefined) {
    return definedVariables[name];
  }
  return null;
}
