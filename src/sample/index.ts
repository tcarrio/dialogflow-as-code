import "reflect-metadata";

import * as fs from "fs";
import Container from "typedi";
import { DialogflowBuilder } from "../builder";
import { DialogflowServiceAccount } from "../config";
import { IntentsService } from "../services";
import { LoggerService, LogLevel } from "../services/logger";
import { DialogflowCreator } from "../sync";
import { DIALOGFLOW_CONFIG, KEY_FILENAME } from "../util";
import { etFruit, etSample } from "./entities";
import { ntFruitInfo, ntFruitReminder } from "./intents";

export async function sample(logLevel: LogLevel = 0) {
  const svcAcctKeyJson = "service-account-key.json";
  const svcAcctConfig: DialogflowServiceAccount = JSON.parse(
    fs.readFileSync(`../../${svcAcctKeyJson}`, { encoding: "utf8" }),
  );
  Container.set(KEY_FILENAME, svcAcctKeyJson);
  Container.set(DIALOGFLOW_CONFIG, svcAcctConfig);

  const logger = new LoggerService(logLevel);
  Container.set(LoggerService, logger);

  const resources = Container.get(DialogflowBuilder)
    .entityTypes([etSample, etFruit])
    .intents([ntFruitInfo, ntFruitReminder])
    .build();

  logger.verbose(JSON.stringify(resources, null, 2));

  const dfc = Container.get(DialogflowCreator);
  await dfc.sync(resources);

  if (logger) {
    (await Container.get(IntentsService))
      .getIntents()
      .then((intents) =>
        logger.verbose(`Intents: ${JSON.stringify(intents, null, 2)}`),
      );
  }
}
