#!/usr/bin/env node

import _ from "lodash";
import { LogLevel } from "../services";
import { ProgramBuilder } from "./common/build-program";
import { DACTestError } from "./common/dac-test-error";
import { exit } from "./common/exit";
import { Logger } from "./common/logger";
import { StatusCode } from "./common/status-code";
import { writeFile } from "./common/write-file";
import { testTemplate } from "./templates/test-template";

async function main() {
  const options = await ProgramBuilder.buildProgram();
  const testFile = testTemplate({
    file: options.file,
    filter: options.filter,
    intents: _.flatten(options.intents),
    entities: _.flatten(options.entities),
    logger: options.logger,
  });
  writeFile(options.file, testFile);
}

//TOP-LEVEL
main().catch((e: Error) => {
  const logger = new Logger(LogLevel.NORMAL);
  logger.error(e);
  if (e instanceof DACTestError) {
    exit(e.code);
  }
  exit(StatusCode.INVALID_USAGE);
});