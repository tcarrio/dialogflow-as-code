import { Field } from "./types";

export const intentDiffFields: Field[] = [
  { value: "webhookState" },
  { value: "priority" },
  { value: "isFallback" },
  { value: "mlEnabled" },
  {
    value: "trainingPhrases",
    subfields: [
      { value: "name" },
      {
        value: "parts",
        subfields: [{ value: "text" }, { value: "entityType" }],
      },
    ],
  },
  { value: "inputContextNames" },
  { value: "events" },
];
