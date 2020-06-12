import { Context } from "dialogflow";

export interface TestIntent {
  input: string;
  display: string;
  text?: string;
  confidence?: number;
  strict?: boolean;
  value?: ValueMap;
  followup?: TestIntent;
  context?: Context[];
}
export interface ValueMap {
  [_: string]: string | number;
}
