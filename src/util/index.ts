import { EntityType } from "dialogflow";
import { LoggerService } from "../services/logger";
import Container from "typedi";

export const intentNameRegex: RegExp = /^projects\/\w+-\w+\/agent\/intents\/w+$/;

export function toJson(err: Record<string, any>) {
  return JSON.stringify(err, null, 2);
}

export function entityLogger(entityType: EntityType) {
  const logger: LoggerService = Container.get(LoggerService);
  logger.verbose(`Entity type name: ${entityType.name}`);
  logger.verbose(`Entity type display name: ${entityType.displayName}`);
  logger.verbose(`Number of entities: ${entityType.entities.length}\n`);
  logger.verbose(`Entities: ${JSON.stringify(entityType.entities, null, 2)}`);
}

export function processGrpc<T>(p: Promise<[T]>, stage?: string): Promise<T> {
  return p
    .then(response => {
      if (response !== null && response.length > 0) {
        return response[0];
      }
      throw new Error("Null value in gRPC response");
    })
    .catch(err => {
      (<LoggerService>Container.get(LoggerService)).error(
        `Error encountered: ${stage}`,
      );
      throw err;
    });
}

export const DIALOGFLOW_CONFIG = "#dfac::dialogflow-config";
export const KEY_FILENAME = "#dfac::key-filename";
export const MASTER_CONFIG = "#dfac::master-config";
