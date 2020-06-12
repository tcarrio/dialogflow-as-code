import { Context } from "dialogflow";

export interface ReportableMatrix {
  labels: string[];
  data: any[][];
}
export interface TestResults {
  testResults: MatrixIntent[],
  errorStack: Error[]
}
export interface LabelMap {
  labels: string[],
  numbers: { [_: string]: number; }
}
export interface ValueMap {
  [_: string]: string | number;
}
export interface MatrixIntent {
  intended: string; //intended intent , X axis
  actual: string; //actual intent , Y axis
  testPhrase: string;
  followup?: MatrixIntent;
}
export interface ConfusionMatrix { //exists due to being a map //REVIEW should I remove this and manually type a map
  [_: string]: MatrixIntent[];
}
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
export interface Error {
  rantest: TestIntent;
  returnedtest: TestIntent;
  messages: string[];
}
