import { EntityType, Parameter, Part, TrainingPhrase } from "dialogflow";
import _ from "lodash";
import { PartParamStruct } from "./defaults";
import { EntityTypeBuilder } from "./entity-type";
import { PartBuilder } from "./parts";
import { IBuilder, isBuilder } from "./types";

export class TrainingPhraseBuilder implements IBuilder<TrainingPhrase> {
  private _trainingPhrase: TrainingPhrase;
  private _params: Parameter[] = [];
  private _paramNames: Set<string> = new Set<string>();

  public constructor(phrases: TrainingPhraseInput[] = []) {
    const parts: (Part | Part[])[] = [];
    const newPhrases = fixSpacing(phrases);
    newPhrases.forEach((phrase) => {
      if (typeof phrase === "string") {
        parts.push({ text: phrase });
      } else {
        let argValue = isBuilder(phrase) ? phrase.build() : phrase;

        argValue = transformIfEntityType(argValue);

        // Extract the parameter to be generated automatically by the Dialogflow builder
        let newValue: Part | Part[];
        if (argValue instanceof PartParamStruct) {
          const tmp = argValue.get();
          this.addToParams(...tmp[1]);
          newValue = tmp[0];
        } else {
          newValue = argValue;
        }

        parts.push(newValue);
      }
    });

    this._trainingPhrase = {
      type: "EXAMPLE",
      parts: _.flatten(parts),
    };
  }

  private addToParams(...params: Parameter[]) {
    params.forEach((param) => {
      if (!this._paramNames.has(param.displayName)) {
        this._paramNames.add(param.displayName);
        this._params.push(param);
      }
    });
  }

  public extractParameters(): Parameter[] {
    return this._params;
  }
  public build(): TrainingPhrase {
    return this._trainingPhrase;
  }
}

const punctuation: Set<string> = new Set<string>(["?", ",", "."]);

function fixSpacing(inputPhrases: TrainingPhraseInput[]): TrainingPhraseInput[] {
  if (inputPhrases.length <= 1) {
    return inputPhrases;
  }

  const space = " ";
  const newPhrases: TrainingPhraseInput[] = [];
  for (let index = 0; index < inputPhrases.length - 1; index++) {
    const existingPhrase = inputPhrases[index];
    const next = inputPhrases[index + 1];

    if (typeof existingPhrase === "string" && typeof next === "string") {
      newPhrases.push(existingPhrase.trimRight() + space + next.trimLeft());
      index++;
    } else if (typeof existingPhrase === "string" && typeof next !== "string") {
      newPhrases.push(existingPhrase.trimRight() + space);
    } else if (typeof existingPhrase !== "string" && typeof next === "string") {
      inputPhrases[index + 1] = space + next.trimLeft();
      newPhrases.push(existingPhrase);
    } else {
      newPhrases.push(existingPhrase, space);
    }
  }

  let phrase = inputPhrases[inputPhrases.length - 1];
  if (typeof phrase === "string") {
    const trimmed = phrase.trim();
    if (punctuation.has(trimmed)) {
      phrase = trimmed;
    } else {
      phrase = space + trimmed;
    }
  }
  newPhrases.push(phrase);

  return newPhrases;
}

type TrainingPhraseInput =
  | string
  | EntityTypeBuilder
  | PartBuilder
  | EntityType
  | Part
  | Part[]
  | PartParamStruct;

type TransformInput = EntityType | Part | Part[] | PartParamStruct;

type TransformOutput = Part | Part[] | PartParamStruct;

export const retrieveText = (et: EntityType) => {
  return et.entities.length > 0 ? et.entities[0].synonyms[0] : et.displayName;
};

function transformIfEntityType(argValue: TransformInput): TransformOutput {
  if (isEntityType(argValue)) {
    const entityTypeValue = `@${argValue.displayName}`;
    const displayName = argValue.displayName;

    const _parts = [
      {
        text: retrieveText(argValue),
        entityType: entityTypeValue,
        userDefined: true,
        alias: displayName,
      },
    ];
    const _params = [{ displayName, entityTypeDisplayName: entityTypeValue }];

    return _params.length > 0 ? new PartParamStruct([_parts, _params]) : _parts;
  }
  return argValue;
}

function isEntityType(value: any): value is EntityType {
  return (
    (value as EntityType).displayName !== undefined &&
    (value as EntityType).entities !== undefined
  );
}

export function tp(phrases: TrainingPhraseInput[] = []): TrainingPhraseBuilder {
  return trainingPhrase(phrases);
}

export function trainingPhrase(
  phrases: TrainingPhraseInput[] = [],
): TrainingPhraseBuilder {
  return new TrainingPhraseBuilder(phrases);
}
