import module from "path";
import { Logger } from "../common/logger";
import fs from "fs";
import { isSchemaValid } from "./schema-validation";
import { DFConfig } from "../common-interfaces/cli-interfaces";
import { DFConfigSchema } from "../joi-schemas/dfconfig-schema";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
import path from "path"
export function verifySchemaDFConfig(
  configFile: string,
  logger: Logger,
): DFConfig {
  if (configFile === undefined) {
    try {
      logger.log("No config provided, aiming for fallback.");
      const config = JSON.parse(
        fs.readFileSync(path.join("..","..","..","service-account-key.json"), "utf-8"),
      );
      isSchemaValid(DFConfigSchema, config);
      return config;
    } catch {
      throw new DACTestError(
        "Config file not provided and fallback service-account-key.json did not work.",
        StatusCode.INVALID_USAGE,
      );
    }
  }
  try {
    logger.verbose("Config parameter provided.");
    const config = JSON.parse(
      fs.readFileSync(module.resolve(configFile), "utf-8"),
    );
    isSchemaValid(DFConfigSchema, config);
    return config;
  } catch (e) {
    if (e instanceof DACTestError) throw e;
    else
      throw new DACTestError(
        `Provided config file is invalid, failed with error: ${e.message}`,
        StatusCode.INVALID_USAGE,
      );
  }
}
