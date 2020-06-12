#!/usr/bin/env node
import { exit } from "./common/exit";
import { StatusCode } from "./common/status-code";
import { Options } from "./common-interfaces/cli-interfaces";
import { TestRunner } from "./testers/test-runner";
import { TestResults } from "./common-interfaces/data-interfaces";
import { DACTestError } from "./common/dac-test-error";
import { ProgramBuilder } from "./common/build-program";
import { Logger, LogLevel } from "./common/logger";

async function main(options: Options) {
  const runner = new TestRunner(options);
  const results: TestResults[] = await runner.runAllTests(options.tests);
  await Promise.all(
    options.reporters.map(reporter => {
      reporter.formatData(results);
      if (reporter.buildChart !== undefined) {
        reporter.buildChart();
      }
      return reporter.activateReport(options.logger);
    }),
  );
  exit(runner.getExitStatus(results));
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
