import { Intent } from "dialogflow";
import Container from "typedi";
import { LoggerService } from "../services/logger";
import { Field, NestedDiff, nestedDiff } from ".";
import { intentDiffFields } from "./fields";

export function diffIntents(
  newIntents: Intent[],
  oldIntents: Intent[],
  fields: Field[] = intentDiffFields,
): NestedDiff<Intent>[] {
  const logger: LoggerService = Container.get(LoggerService);
  logger.verbose(
    `Started diffIntents: (New: ${newIntents.length}, Old: ${oldIntents.length})`,
  );
  logger.verbose(
    `New intents display names: ${newIntents.map((i) => i.displayName)}`,
  );
  logger.verbose(
    `Old intents display names: ${oldIntents.map((i) => i.displayName)}`,
  );
  const map: { [displayName: string]: { old?: Intent; new?: Intent } } = {};

  newIntents.forEach((intent) => (map[intent.displayName] = { new: intent }));
  oldIntents.forEach((intent) => {
    if (map[intent.displayName] !== undefined) {
      logger.verbose(`Found key: ${intent.displayName}`);
      map[intent.displayName].old = intent;
    } else {
      logger.verbose(`No key: ${intent.displayName}`);
      delete map[intent.displayName];
    }
  });
  logger.verbose(`map contains: ${JSON.stringify(map, null, 2)}`);

  logger.verbose("Nested diff of found intents");
  return Object.keys(map)
    .map((name) => nestedDiff<Intent>(map[name].new!, map[name].old!, fields))
    .filter((x: object) => Object.keys(x).length !== 0);
}
