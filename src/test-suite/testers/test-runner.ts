import { SessionsClient } from "dialogflow";
import {
  DFConfig,
  TestFile,
  Options,
  TestConfig,
} from "../common-interfaces/cli-interfaces";
import uuid from "uuid";
import {
  Error,
  TestIntent,
  MatrixIntent,
  TestResults,
} from "../common-interfaces/data-interfaces";
import { StatusCode } from "../common/status-code";
import { IntentTester } from "./intent-tester";
import chalk from "chalk";
import { Logger } from "../common/logger";
import { delay } from "../common/delay";
export class TestRunner {
  private speed: number;
  private logger: Logger;
  private session = SessionsClient.prototype;
  private config: TestConfig = {
    failure: {
      strict: 0,
    },
  };
  private projectID: string;
  public constructor(key: Options) {
    this.logger = key.logger;
    this.projectID = key.config.project_id;
    this.speed = key.speed ? 101 : 352;
    this.createSession(key.config);
  }
  public getExitStatus(results: TestResults[]): StatusCode {
    let [strictfails, laxfails, tests] = [0, 0, 0];
    results.map(result => {
      tests += result.testResults.length;
      result.errorStack.map(error => {
        if (error.rantest.strict !== undefined && !error.rantest.strict) {
          laxfails++;
        } else {
          strictfails++;
        }
      });
    });
    if (
      this.config.failure &&
      this.config.failure.strict !== undefined &&
      strictfails > this.config.failure.strict
    ) {
      this.logger.verbose("\nStrict failure limit hit");
      return StatusCode.TEST_FAILURE;
    }
    if (
      this.config.failure &&
      this.config.failure.lax !== undefined &&
      laxfails > this.config.failure.lax / tests
    ) {
      this.logger.verbose("\nLax failure limit hit");
      return StatusCode.TEST_FAILURE;
    }
    return StatusCode.OKAY;
  }
  public async runAllTests(files: TestFile[]): Promise<TestResults[]> {
    const results: TestResults[] = [];
    for (const file of files) {
      await delay(this.speed);
      results.push(await this.runTests(file));
    }
    return results;
  }
  public async runTests(file: TestFile): Promise<TestResults> {
    this.setConfig(file.failure);
    const testResults: TestResults[] = [];
    for (const intent of file.intents) {
      const sessionID = uuid.v4();
      testResults.push(await this.runTest(intent, sessionID));
    }
    return Promise.all(testResults).then((value: TestResults[]) => {
      const defaultResults: TestResults = { testResults: [], errorStack: [] };
      return value.reduce<TestResults>(
        (previous, results) => ({
          testResults: [...previous.testResults, ...results.testResults],
          errorStack: [...previous.errorStack, ...results.errorStack],
        }),
        defaultResults,
      );
    });
  }
  private setConfig(config: TestFile["failure"]): void {
    this.config.failure = config;
  }
  private generateErrors(
    intent: TestIntent,
    response: TestIntent,
    parent?: TestIntent,
  ): Error[] {
    const errorStack: Error[] = [];
    //this logic tests if dialogflow agrees with our expectations
    const messages: string[] = [];
    if (parent !== undefined) {
      messages.push(
        `${chalk.yellow("\nFollowup")} of context: ${parent.input}`,
      );
      messages.push(
        `${chalk.cyan(" Test phrase: ")} ${chalk.redBright(intent.input)}`,
      );
    } else {
      messages.push(
        `${chalk.cyan("\n Test phrase: ")} ${chalk.redBright(intent.input)}`,
      );
    }
    let errorFlip = false;
    if (response.display !== intent.display) {
      errorFlip = true;
      messages.push(
        `${chalk.magentaBright(
          "  Intent",
        )} returned by dialogflow did not match intent expected.\n     Intent expected: ${chalk.red(
          intent.display,
        )} \n     Intent received: ${chalk.red(response.display)}`,
      );
    }
    if (intent.text && response.text) {
      if (response.text !== intent.text) {
        errorFlip = true;
        messages.push(
          `${chalk.magentaBright(
            "   Text",
          )} returned by dialogflow did not match text expected.\n     Text expected: ${chalk.red(
            intent.text,
          )}\n     Text received: ${chalk.red(response.text)}`,
        );
      }
    }
    if (intent.confidence && response.confidence) {
      if (response.confidence < intent.confidence) {
        errorFlip = true;
        messages.push(
          `${chalk.magentaBright(
            "   Confidence",
          )} returned by dialogflow did not meet expectations.\n     Confidence expected: ${chalk.red(
            intent.confidence.toString(),
          )}\n     Confidence received: ${chalk.red(
            response.confidence.toString(),
          )}`,
        );
      }
    }
    if (intent.value && response.value) {
      if (Object.keys(intent.value).length > 0) {
        for (const value in intent.value) {
          if (
            intent.value[value] === response.value[value] &&
            intent.value[value] !== ""
          ) {
          } else if (
            intent.value[value] === "" &&
            response.value[value] !== ""
          ) {
          } else if (intent.value[value] === "") {
            errorFlip = true;
            messages.push(
              `${chalk.magentaBright(
                "   Value",
              )} was not extracted correctly by Dialogflow\n    Any ${chalk.red(
                value,
              )} value expected, none received`,
            );
          } else if (response.value[value] !== "") {
            errorFlip = true;
            messages.push(
              `${chalk.magentaBright(
                "   Value",
              )} was not extracted correctly by Dialogflow\n     Value expected: ${chalk.red(
                value,
              )}: ${chalk.red(JSON.stringify(intent.value[value]))}`,
            );
            if (response.value[value] !== undefined) {
              messages.push(
                `     Value received: ${chalk.red(value)}: ${chalk.red(
                  JSON.stringify(response.value[value]),
                )}`,
              );
            } else {
              messages.push("     Value was not returned by Dialogflow");
            }
          }
        }
      }
    }
    if (errorFlip) {
      errorStack.push({
        rantest: intent,
        returnedtest: response,
        messages,
      });
    }
    return errorStack;
  }
  private async runTest(
    intent: TestIntent,
    sessionID: string,
    parent?: TestIntent,
  ): Promise<TestResults> {
    await delay(this.speed);
    const response: TestIntent = await IntentTester.checkIntents(
      intent,
      this.session,
      this.logger,
      sessionID,
      this.projectID,
    );
    const testResults: MatrixIntent[] = [
      {
        intended: intent.display,
        actual: response.display,
        testPhrase: intent.input,
      },
    ];
    const errorStack: Error[] = [];
    parent !== undefined
      ? errorStack.push(...this.generateErrors(intent, response, parent))
      : errorStack.push(...this.generateErrors(intent, response));
    if (intent.followup !== undefined) {
      const followup = await this.runTest(intent.followup, sessionID, intent);
      testResults.push(...followup.testResults);
      errorStack.push(...followup.errorStack);
    }
    return { testResults, errorStack };
  }
  private createSession(key: DFConfig): void {
    this.session = new SessionsClient({
      credentials: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        private_key: key.private_key,
        // eslint-disable-next-line @typescript-eslint/camelcase
        client_email: key.client_email,
      },
    });
  }
}
