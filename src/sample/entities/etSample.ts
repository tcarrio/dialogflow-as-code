import { EntityType } from "dialogflow";

export const etSample: EntityType = {
  displayName: "sample",
  entities: [{ value: "sample", synonyms: ["piece", "swab", "choice"] }],
  kind: "KIND_MAP",
  autoExpansionMode: "AUTO_EXPANSION_MODE_DEFAULT",
};
