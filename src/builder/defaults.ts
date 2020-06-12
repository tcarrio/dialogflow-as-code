import { Part, Parameter } from "dialogflow";
import { DateTimeResolver } from "./dates";

export function det(key: DefaultEntity, param: string = ""): PartParamStruct {
  const entityTypeDisplayName = `@sys.${key}`;
  const name = param || key;

  const parts: Part[] = [
    {
      text: name,
      entityType: entityTypeDisplayName,
      userDefined: true,
      alias: name,
    },
  ];

  const dfParam: Parameter[] = [
    {
      displayName: param ? param : key,
      entityTypeDisplayName,
      value: param ? `$${param}` : `$${key}`,
      // TODO: defaultValue?
    },
  ];

  if (key === "date-time") {
    dfParam.push({
      displayName: "date-time-original",
      value: "$date-time.original",
    });
    if (!param) {
      parts[0].text = DateTimeResolver.next();
    }
  }

  return new PartParamStruct([parts, dfParam]);
}

export class PartParamStruct {
  private value: [Part[], Parameter[]];
  public constructor(value: [Part[], Parameter[]]) {
    this.value = value;
  }
  public get() {
    return this.value;
  }
}

type DefaultEntity =
  | "age"
  | "any"
  | "date-time"
  | "date"
  | "duration"
  | "email"
  | "given-name"
  | "ignore"
  | "location"
  | "music-genre"
  | "number-sequence"
  | "number"
  | "temperature"
  | "time"
  | "url";
