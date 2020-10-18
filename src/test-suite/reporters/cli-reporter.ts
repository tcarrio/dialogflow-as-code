import chalk from "chalk";
import figlet from "figlet";
import { Reporter } from "../common-interfaces/cli-interfaces";
import { TestResults } from "../common-interfaces/data-interfaces";
import { Logger } from "../common/logger";

export class CLIReporter implements Reporter {
  private data: TestResults[] = [];
  public formatData(data: TestResults[]) {
    this.data = data;
  }
  public activateReport(logger: Logger): void {
    logger.log(chalk.magenta(figlet.textSync("DAC Testing Suite", "Big")));
    let [testsRan, failures] = [0, 0];
    this.data.forEach(testFileResult => {
      testsRan += testFileResult.testResults.length;
      failures += testFileResult.errorStack.length;
    });
    logger.log(chalk.blue("Tests ran: ") + testsRan);
    logger.log(chalk.green("Succeeded: ") + (testsRan - failures));
    logger.log(chalk.red("Failures: ") + failures);
    this.data.forEach(testFileResult => {
      testFileResult.errorStack.forEach(error => {
        error.messages.forEach(message => {
          logger.log(`${message}`);
        });
      });
    });
  }
}
