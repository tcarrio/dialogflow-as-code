import {
  filterGlobs,
  emitterToPromise,
  parseAs,
  DEFAULT_PARSE_OPTS,
} from "./base";
import { IntentImport, IntentDefImport, TrainingPhrase } from "../../common";

import { EventEmitter } from "events";
import { Glob } from "glob";
import path from "path";
import { isString } from "util";
import { INTENT_DIR } from "../../common/globals";
import { setIntentName } from "../../common/mapper";

const INTENTS_PHRASES_REGEX = /^.+\/(.+)_usersays_..\.json$/;

export async function getIntents(filePath: string): Promise<IntentImport[]> {
  const intentEmitter: EventEmitter = new Glob(
    `${filePath}/${INTENT_DIR}/*.json`,
  );
  const intentEntSet: Set<string> = new Set([]);
  const intentDefSet: Set<string> = new Set([]);

  return emitterToPromise(intentEmitter)
    .then(filterGlobs(intentEntSet, intentDefSet, INTENTS_PHRASES_REGEX))
    .then(intentNames => {
      return intentNames.map(name =>
        importIntent(`${filePath}/${INTENT_DIR}`, name),
      );
    });
}

function importIntent(filePath: string, name: string): IntentImport {
  const definitionMatch = path.join(filePath, `${name}.json`);
  const intentDefinition: IntentDefImport = parseAs<IntentDefImport>(
    definitionMatch,
  );

  fixResponseSpeechTypes(intentDefinition);

  const phrasesMatch = path.join(filePath, `${name}_usersays_en.json`);
  const trainingPhrases = parseAs<TrainingPhrase[]>(phrasesMatch, {
    ...DEFAULT_PARSE_OPTS,
    defaultVal: [],
  });
  replaceSysIgnores(trainingPhrases);
  const intent: IntentImport = { ...intentDefinition, trainingPhrases };

  if (intent.id && intent.name) {
    setIntentName(intent.id, intent.name);
  }

  return intent;
}

function fixResponseSpeechTypes(intentDefinition: IntentDefImport) {
  for (let i in intentDefinition.responses) {
    for (let j in intentDefinition.responses[i].messages) {
      const sp = intentDefinition.responses[i].messages[j].speech;
      intentDefinition.responses[i].messages[j].speech = isString(sp)
        ? [sp]
        : sp;
    }
  }
}

function replaceSysIgnores(trainingPhrases: TrainingPhrase[]) {
  for (let i in trainingPhrases) {
    let wasText = false;
    let j = 0;
    while (j < trainingPhrases[i].data.length) {
      const meta = trainingPhrases[i].data[j].meta;
      if (meta === "@sys.ignore") {
        if (wasText) {
          trainingPhrases[i].data[j - 1].text +=
            trainingPhrases[i].data[j].text;
          trainingPhrases[i].data.splice(j, 1);
        } else {
          delete trainingPhrases[i].data[j].meta;
          wasText = true;
          j++;
        }
      } else if (meta === undefined && wasText) {
        trainingPhrases[i].data[j - 1].text += trainingPhrases[i].data[j].text;
        trainingPhrases[i].data.splice(j, 1);
      } else if (meta !== undefined) {
        wasText = false;
        j++;
      } else {
        wasText = true;
        j++;
      }
    }
  }
}
