import { PartParamStruct } from "./defaults";
import { EntityType, Part, Parameter } from "dialogflow";
import { IBuilder } from "./types";
import { retrieveText } from "./training-phrases";

export class PartBuilder implements IBuilder<Part[] | PartParamStruct> {
  private _part: Part[] = [];
  private _param: Parameter[] = [];
  public constructor(entityType: string | EntityType = "") {
    this.setEntity(entityType);
  }
  public e(entity: string) {
    this.validatePart(entity);
    this._part[0].entityType = entity;
    return this;
  }
  public t(text: string) {
    if (this.validatePart(text)) {
      this._part[0].text = text;
    }
    return this;
  }
  private validatePart(text: string): boolean {
    const invalid: boolean = this._part.length === 0;
    if (this._part.length === 0) {
      this._part = [{ text: text }];
    }
    return !invalid;
  }
  private setEntity(entityType: string | EntityType) {
    if (!entityType) {
      return;
    }

    let entityTypeValue: string;
    let displayName: string;
    let text: string;
    if ((entityType as EntityType).displayName !== undefined) {
      const et = entityType as EntityType;
      entityTypeValue = `@${et.displayName}`;
      displayName = et.displayName;
      text = retrieveText(et);
    } else {
      const entityString = entityType as string;
      entityTypeValue = `@${entityString}`;
      displayName = entityString;
      text = entityString;
    }
    this._part = [
      {
        text,
        entityType: entityTypeValue,
        userDefined: true,
        alias: displayName,
      },
    ];
    this._param = [
      { displayName: displayName, entityTypeDisplayName: entityTypeValue },
    ];
  }
  public build(): Part[] | PartParamStruct {
    return this._param.length > 0
      ? new PartParamStruct([this._part, this._param])
      : this._part;
  }
}

export function pb(value: string | EntityType = "") {
  return new PartBuilder(value);
}
