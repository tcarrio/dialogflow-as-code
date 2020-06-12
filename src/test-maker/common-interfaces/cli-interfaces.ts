import { Intent, EntityType } from "dialogflow";
import { Logger } from "../common/logger";
import { TestIntent } from "./data-interfaces";

export interface Options {
  file: string;
  filter?: string[];
  entities: EntityType[];
  intents: Intent[];
  logger: Logger;
}
export interface TestFile {
  failure?: {
    strict?: number;
    lax?: number;
  };
  intents: TestIntent[];
}
