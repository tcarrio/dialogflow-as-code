import { TestIntent } from "../common-interfaces/data-interfaces";
import { SessionsClient } from "dialogflow";
import { structProtoToJson } from "../common/struct-json";
import { Logger } from "../common/logger";
import { Context, ContextsClient } from "dialogflow";
export class IntentTester {
  static async checkIntents(
    intent: TestIntent,
    sessionsClient: SessionsClient,
    logger: Logger,
    sessionID: string,
    projectID: string,
  ): Promise<TestIntent> {
    logger.verbose("Contacting dialogflow with " + JSON.stringify(intent));
    const contextNames: Context[] = [];
    const session = sessionsClient.sessionPath(projectID, sessionID)//session.getProjectId() does not work //NOTE
    if (intent.context) {
      const contextsClient = new ContextsClient();
      contextNames.push(
        ...intent.context.map(context => {
          return {
            name: contextsClient.contextPath(
              projectID,
              sessionID,
              context.name,
            ),
            lifespanCount: 1,
          };
        }),
      );
    }
    const res = intent.context
      ? await sessionsClient.detectIntent({
          queryInput: {
            text: {
              languageCode: "en-US",
              text: intent.input,
            },
          },
          queryParams: {
            contexts: contextNames,
          },
          session,
        })
      : await sessionsClient.detectIntent({
          queryInput: {
            text: {
              languageCode: "en-US",
              text: intent.input,
            },
          },
          session,
        });

    const params = structProtoToJson(res);
    //console.log(res);
    if (res !== null && res[0].queryResult !== null && res[0].queryResult.intent !== null) {
      return {
        input: res[0].queryResult.queryText,
        display: res[0].queryResult.intent.displayName,
        text: res[0].queryResult.fulfillmentText,
        confidence: res[0].queryResult.intentDetectionConfidence,
        value: params,
      };
    } else {
      return {
        input: intent.input,
        display: JSON.stringify(res),
        text: "Error/NULL",
        confidence: 0,
        value: {},
      };
    }
  }
}
