const _idVarMap: { [key: string]: string } = {};

export function setIntentName(id: string, name: string) {
  _idVarMap[id] = name;
}

export function getIntentName(id: string): string | null {
  const varName = _idVarMap[id];
  if (varName !== undefined) {
    return varName;
  }
  return null;
}
