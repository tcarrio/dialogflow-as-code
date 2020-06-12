import { getVersion } from "../../util/version";
import { Command } from "commander";
import { Options } from "../common-interfaces/cli-interfaces";
import { Logger, LogLevel } from "./logger";
import { DACTestError } from "./dac-test-error";
import { StatusCode } from "./status-code";
import { verifySchemaIntents } from "../option-verification/verify-schema-intents";
import { Intent, EntityType } from "dialogflow";
import { verifySchemaEntities } from "../option-verification/verify-schema-entities";
import _ from "lodash";
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
        "This is a CLI for converting DAC projects to tests.js skeletons to be used with DAC test pipeline CLI >github<",
      ) //TODO add real link
      .option(
        "-i, --input <DIRECTORY>",
        "Specify a a dialogflow as code directory.",
        this.collectMultiple,
        [],
      )
      .option(
        "-f, --filter <STRING>",
        "Filters out any intent that starts with the string specified",
        this.collectMultiple,
        [],
      )
      .option("-s, --silent", "Silences clis default pipeline console log")
      .option("-o, --output <FILE>", "Specifies a file to write the tests")
      .option(
        "-v, --verbose",
        "Enables additonal logging info (outside default pipeline log[this option is overwritten by --silent/-s])",
      )
      .parse(process.argv);
    return program;
  }
  private static async generateConfig(
    program: Command,
    logger: Logger,
  ): Promise<Options> {
    try {
      if (program.input.length === 0) throw new Error();
      const intents: Intent[] = _.flatten(
        program.input.map(async (inputDirectory: string) => {
          return [
            ...(await verifySchemaIntents(
              inputDirectory + "/intents/index.js",
            )),
          ];
        }),
      );
      const entities: EntityType[] = _.flatten(
        program.input.map(async (inputDirectory: string) => {
          return [
            ...(await verifySchemaEntities(
              inputDirectory + "/entities/index.js",
            )),
          ];
        }),
      );
      const file: string = program.output ? program.output : "./tests.json";
      const filter: string[] = program.filter.map((phrase: string) => {
        return phrase;
      });
      return {
        file,
        filter,
        entities,
        intents,
        logger,
      };
    } catch (e) {
      if (e instanceof DACTestError) throw e;
      else
        throw new DACTestError(
          "Input was not provided",
          StatusCode.INVALID_USAGE,
        );
    }
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
  public static async buildProgram(): Promise<Options> {
    const program = this.parseArgs();
    return await this.generateConfig(program, this.buildLogger(program));
  }
}
