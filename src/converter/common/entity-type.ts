import { Entity } from "dialogflow";

export interface EntityTypeImport extends EntityDefImport {
  entities: Entity[];
}

export interface EntityDefImport {
  id: string;
  name: string;
  isOverridable: boolean;
  isEnum: boolean;
  isRegexp: boolean;
  automatedExpansion: boolean;
  allowFuzzyExtraction: boolean;
}
