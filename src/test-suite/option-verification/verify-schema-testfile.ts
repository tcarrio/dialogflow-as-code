import { Logger } from "../common/logger";
import module from "path";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
import { isSchemaValid } from "./schema-validation";
import { TestFile } from "../common-interfaces/cli-interfaces";
import { TestFileSchema } from "../joi-schemas/test-file-schema";
export function verifySchemaTestFile(
  testFileNames: string[],
  logger: Logger,
): TestFile[] {
  if (testFileNames === undefined || testFileNames.length === 0) {
    throw new DACTestError(
      "At least one test file must be provided...",
      StatusCode.INVALID_USAGE,
    );
  }
  logger.verbose("Test file argument verified to exist.");
  const tests: TestFile[] = testFileNames.map(testFileName => {
    logger.verbose(testFileName + " is being verified.");
    return getTest(testFileName);
  });
  logger.verbose("All test files verified.");
  return tests;
}
function getTest(testFileName: string): TestFile {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const test: TestFile = require(module.resolve(testFileName));
    isSchemaValid(TestFileSchema, test);
    return test;
  } catch (e) {
    if (e instanceof DACTestError) throw e;
    else
      throw new DACTestError(
        `Failed to load test file: ${testFileName} .failed with error: ${
          e.message
        }`,
        StatusCode.INVALID_USAGE,
      );
  }
}
