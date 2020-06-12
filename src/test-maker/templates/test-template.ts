import { Intent, Context, EntityType } from "dialogflow";
import { TestIntent } from "../common-interfaces/data-interfaces";
import { TestFile, Options } from "../common-interfaces/cli-interfaces";
import { entityConverter } from "../common/entity-converter";
import _ from "lodash";

export function testTemplate(options: TestOptions): TestFile {
  const tests: TestIntent[] = _.flatten(
    options.intents
      .filter(
        (intent: Intent) =>
          intent.trainingPhrases &&
          intent.trainingPhrases.length > 0 &&
          arrayCheck(options, intent),
      )
      .map(
        (intent: Intent): TestIntent[] => {
          return intent.trainingPhrases!.map(phrase => {
            const contextArray: Context[] = intent.inputContextNames
              ? intent.inputContextNames.map(name => ({ name }))
              : [];
            let finalPhrase: string = phrase.parts
              .map(part =>
                part.entityType
                  ? entityConverter(part, options.entities)
                  : part.text,
              )
              .join("");
            return {
              input: finalPhrase,
              display: intent.displayName,
              strict: true,
              context: contextArray,
            };
          });
        },
      ),
  );
  return {
    failure: {
      strict: 0,
      lax: 100,
    },
    intents: tests,
  };
}

function arrayCheck(options: TestOptions, intent: Intent): boolean {
  if (options.filter && intent.displayName)
    for (let phrase of options.filter) {
      if (intent.displayName.startsWith(phrase, 0)) return false;
    }
  return true;
}

type TestOptions = Partial<Options> & {
  entities: EntityType[];
  intents: Intent[];
};
