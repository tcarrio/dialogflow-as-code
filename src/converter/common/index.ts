import { Agent } from "./agent";
import { EntityTypeImport } from "./entity-type";
import { IntentImport } from "./intent";

export interface DialogflowBundle {
  agent?: Agent;
  entityTypes: EntityTypeImport[];
  intents: IntentImport[];
}

export type OptString = string | undefined;

export * from "./agent";
export * from "./entity-type";
export * from "./intent";
export * from "./template";
export * from "./variables";
export * from "./formatter";
