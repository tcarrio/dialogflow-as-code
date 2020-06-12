import * as dialogflow from "dialogflow";

export interface IntentImport extends IntentDefImport {
  trainingPhrases: TrainingPhrase[];
}

export interface TrainingPhrase {
  id: string;
  data: PartImport[];
  isTemplate: boolean;
  count: number;
  updated: number;
}

export interface IntentDefImport {
  id: string;
  name: string;
  auto: boolean;
  contexts: string[];
  responses: Response[];
  priority: number;
  webhookUsed: boolean;
  webhookForSlotFilling: boolean;
  lastUpdate: number;
  fallbackIntent: boolean;
  parentId: string;
  events: any[]; // TODO: Determine type instead of 'any'
}

export interface Response {
  resetContexts: boolean;
  affectedContexts: dialogflow.Context[];
  parameters: Parameter[];
  messages: Message[];
  defaultResponsePlatforms: any[]; // TODO: Determine type instead of 'any'
  speech: any[]; // TODO: Determine type instead of 'any'
}

interface Parameter {
  id: string;
  required: boolean;
  dataType: string;
  name: string;
  value: string;
  isList: boolean;
  prompts: Prompt[];
  // TODO: Determine default value field
}

interface Prompt {
  lang: Locale; // TODO: Determine all locales
  value: string;
}

type Locale = "en";

export interface Message {
  type: number;
  lang: string;
  speech: string[];
}

export interface PartImport extends dialogflow.Part {
  meta: string;
}
