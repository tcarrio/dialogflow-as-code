import { TemplateMap } from ".";

export interface TemplateBundle {
  entityTypes: TemplateMap;
  intents: TemplateMap;
  events: string;
  contexts: TemplateMap;
}

export interface TemplateMap {
  [key: string]: string;
}
