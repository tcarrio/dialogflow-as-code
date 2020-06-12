import { getVersion } from "../../util/version";
import { Command } from "commander";
import { Options } from "../common-interfaces/cli-interfaces";
import { Logger, LogLevel } from "./logger";
import { verifySchemaTestFile } from "../option-verification/verify-schema-testfile";
import { verifySchemaDFConfig } from "../option-verification/verify-schema-dfconfig";
import { verifySchemaReporter } from "../option-verification/verify-schema-reporter";
import { CLIReporter } from "../reporters/cli-reporter";
import { JSONReporter } from "../reporters/json-reporter";
export class ProgramBuilder {
  private static collectMultiple<T>(program: T, programs?: T[]): T[] {
    programs = programs || [];
    programs.push(program);
    return programs;
  }
  private static parseArgs(): Command {
    const program = new Command("dac-test");
    program
      .version(getVersion())
      .description(
        "This is a CLI for testing of Dialogflow intents, for further help vist >github<",
      ) //TODO add real link
      .option(
        "-r, --reporters <FILES...>",
        "Specifies which reporter to use, defaults to json reporter",
        this.collectMultiple,
        [],
      )
      .option(
        "-j, --json <FILE>",
        "Enables a built-in JSON reporter to write results to a location of your choice.",
      )
      .option(
        "-t, --tests <FILES...>",
        "Specify a js file that contains tests",
        this.collectMultiple,
        [],
      )
      .option("--fast", "Enables fast api calls for enterprise tier testing.")
      .option("-s, --silent", "Silences clis default pipeline console log")
      .option(
        "-v, --verbose",
        "Enables additonal logging info (outside default pipeline log[this option is overwritten by --silent/-s])",
      )
      .option(
        "-c, --config <FILE>",
        "Specify which Dialogflow account file to use, defaults to service-account-key.json",
      )
      .parse(process.argv);
    return program;
  }
  private static generateConfig(program: Command, logger: Logger): Options {
    const speed = program.fast ? true : false;
    const options: Options = {
      reporters: [new CLIReporter()],
      tests: verifySchemaTestFile(program.tests, logger),
      config: verifySchemaDFConfig(program.config, logger),
      logger,
      speed,
    };
    logger.verbose("All reporters verified.");
    if (program.reporters) {
      options.reporters.push(
        ...verifySchemaReporter(program.reporters, logger),
      );
    }
    if (program.json && options.reporters !== undefined) {
      options.reporters.push(new JSONReporter(program.json));
    }
    return options;
  }
  private static buildLogger(program: Command): Logger {
    const logger = new Logger();
    program.silent
      ? logger.setLevel(LogLevel.SILENT)
      : program.verbose
      ? logger.setLevel(LogLevel.VERBOSE)
      : logger.setLevel(LogLevel.NORMAL);
    return logger;
  }
  public static buildProgram(): Options {
    const program = this.parseArgs();
    return this.generateConfig(program, this.buildLogger(program));
  }
}
