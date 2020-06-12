import "reflect-metadata";

import Container from "typedi";
import { KEY_FILENAME, DIALOGFLOW_CONFIG } from "../util";
import { DialogflowServiceAccount } from "../config";
import { DialogflowBuilder } from "../builder";
import { DialogflowCreator } from "../sync";
import { IntentsService } from "../services";
import { etSample, etFruit } from "./entities";
import { ntFruitInfo, ntFruitReminder } from "./intents";
import { LoggerService, LogLevel } from "../services/logger";

export async function sample(logLevel: LogLevel = 0) {
  const svcAcctKeyJson: string = "service-account-key.json";
  const svcAcctConfig: DialogflowServiceAccount = require(`../../${svcAcctKeyJson}`);
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
      .then(intents =>
        logger.verbose(`Intents: ${JSON.stringify(intents, null, 2)}`),
      );
  }
}
