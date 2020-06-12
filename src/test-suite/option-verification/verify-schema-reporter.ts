import { Logger } from "../common/logger";
import { Reporter } from "../common-interfaces/cli-interfaces";
import module from "path";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
export function verifySchemaReporter(
  reporterFileNames: string[],
  logger: Logger,
): Reporter[] {
  return reporterFileNames.map(reporterFileName => {
    logger.verbose(
      reporterFileName + " is being verified and loaded as a reporter.",
    );
    return getReporter(reporterFileName);
  });
}
function getReporter(reporterFileName: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const reporterNamespace = require(module.resolve(reporterFileName)); //REVIEW is this a namespace?
    const reporter: Reporter = new reporterNamespace.Reporter();
    return reporter;
  } catch (e) {
    if (e instanceof DACTestError) throw e;
    else
      throw new DACTestError(
        `Failed to load reporter: ${reporterFileName}, failed with error ${
          e.message
        }`,
        StatusCode.INVALID_USAGE,
      );
  }
}
