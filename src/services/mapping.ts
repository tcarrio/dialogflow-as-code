import { Service } from "typedi";

@Service()
export class MappingService {
  private nameMap: { [displayName: string]: string } = {};
  private inverseMap: { [name: string]: string } = {};

  constructor() {}

  public getName(displayName: string): string | null {
    if (displayName in this.nameMap) {
      return this.nameMap[displayName];
    }
    return null;
  }

  public setName(displayName: string, name: string): void {
    this.nameMap[displayName] = name;
    this.inverseMap[name] = displayName;
  }

  public unsetName(name: string): void {
    const displayName = this.getName(name);
    if (displayName !== null) {
      delete this.inverseMap[name];
      delete this.nameMap[displayName];
    }
  }
}
