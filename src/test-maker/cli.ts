#!/usr/bin/env node

import { ProgramBuilder } from "./common/build-program";
import { Options } from "./common-interfaces/cli-interfaces";
import { DACTestError } from "./common/dac-test-error";
import { exit } from "./common/exit";
import { StatusCode } from "./common/status-code";
import { testTemplate } from "./templates/test-template";
import { writeFile } from "./common/write-file";
import _ from "lodash";
import { Logger } from "./common/logger";
import { LogLevel } from "../services";

async function main(options: Promise<Options>) {
  const testFile = testTemplate({
    file: (await options).file,
    filter: (await options).filter,
    intents: _.flatten(await Promise.all((await options).intents)),
    entities: _.flatten(await Promise.all((await options).entities)),
    logger: (await options).logger,
  });
  writeFile((await options).file, testFile);
}

//TOP-LEVEL
try {
  const options = ProgramBuilder.buildProgram();
  main(options);
} catch (e) {
  const logger = new Logger(LogLevel.NORMAL);
  logger.error(e);
  if (e instanceof DACTestError) {
    exit(e.code);
  }
  exit(StatusCode.INVALID_USAGE);
}
