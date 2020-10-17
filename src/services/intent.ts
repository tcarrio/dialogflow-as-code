// https://cloud.google.com/dialogflow-enterprise/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.Intent

import { Service, Inject } from "typedi";
import {
  Intent,
  IntentsClient,
  ListIntentsRequest,
  GetIntentRequest,
  CreateIntentRequest,
  DeleteIntentRequest,
  UpdateIntentRequest,
} from "dialogflow";
import { DialogflowServiceAccount } from "../config";
import { DIALOGFLOW_CONFIG, processGrpc } from "../util";
import { MappingService } from ".";
import { LoggerService } from "./logger";

@Service()
class IntentsService {
  private intentsClient: IntentsClient;
  private projectAgentPath: string;

  public constructor(
    @Inject(DIALOGFLOW_CONFIG) private svcAcctConfig: DialogflowServiceAccount,
    private mapper: MappingService,
    private logger: LoggerService,
  ) {
    this.intentsClient = new IntentsClient({ credentials: svcAcctConfig });
    this.projectAgentPath = this.intentsClient.projectAgentPath(
      this.svcAcctConfig.project_id,
    );
    this.logger.log(`Project agent path: ${this.projectAgentPath}`);
  }

  public getIntentsPath(): string {
    return `${this.projectAgentPath}/intents/`;
  }

  public async getIntents(): Promise<Intent[]> {
    const listIntentsRequest: ListIntentsRequest = {
      parent: this.projectAgentPath,
    };

    const intents = await processGrpc(
      this.intentsClient.listIntents(listIntentsRequest),
    );
    if (intents === null) {
      throw new Error("Null intents in getIntents");
    }

    for (let intent of intents) {
      this.logger.log(`Mapping ${intent.displayName} to ${intent.name}`);
      this.mapper.setName(intent.displayName, intent.name!);
    }

    return intents;
  }

  public async getIntent(name: string): Promise<Intent> {
    const getIntentRequest: GetIntentRequest = { name };

    const intent = await processGrpc(
      this.intentsClient.getIntent(getIntentRequest),
    );

    if (intent !== null) {
      this.mapper.setName(intent.displayName, intent.name!);
    }

    return intent;
  }

  public async getIntentByDisplayName(
    displayName: string,
  ): Promise<Intent | null> {
    const name = this.mapper.getName(displayName);
    return name === null
      ? null
      : this.getIntents().then((intents) => {
          const matches = intents.filter((x) => x.displayName == displayName);
          if (matches.length === 1) {
            return matches[0];
          }
          return null;
        });
  }

  public async createIntent(intent: Intent): Promise<Intent> {
    const createIntentRequest: CreateIntentRequest = {
      parent: this.projectAgentPath,
      intent,
    };
    const response = this.intentsClient.createIntent(createIntentRequest);

    return processGrpc(response);
  }

  public async updateIntent(intent: Intent): Promise<Intent> {
    const updateIntentRequest: UpdateIntentRequest = { intent };

    const response = this.intentsClient.updateIntent(updateIntentRequest);

    return processGrpc(response);
  }

  public async updateIntentByDisplayName(
    displayName: string,
    intent: Intent,
  ): Promise<Intent | null> {
    const name = this.mapper.getName(displayName);
    if (name !== null) {
      return this.updateIntent({ ...intent, name });
    }
    return this.getIntentByDisplayName(displayName).then((existingIntent) => {
      if (existingIntent !== null) {
        return this.updateIntent({
          ...intent,
          name: existingIntent.name!,
        });
      }
      return Promise.resolve(null);
    });
  }

  public async batchCreateIntents(intents: Intent[]) {
    return this.batchUpdateIntents(intents);
  }

  public async batchUpdateIntents(intents: Intent[]) {
    return this.intentsClient.batchUpdateIntents({
      parent: this.projectAgentPath,
      intentBatchInline: {
        intents: intents,
      },
    });
  }

  public async deleteIntent(name: string) {
    const deleteIntentRequest: DeleteIntentRequest = { name };

    await this.intentsClient.deleteIntent(deleteIntentRequest);

    this.mapper.unsetName(name);
  }

  public async deleteIntentByDisplayName(displayName: string) {
    return this.getIntentByDisplayName(displayName).then(
      (intent: Intent | null) => {
        if (intent !== null && intent.name) {
          this.mapper.unsetName(intent.name);
          this.deleteIntent(intent.name);
        }
      },
    );
  }

  /** BatchDeleteIntentsRequest:
   *  Per the documentation on [Google Cloud](https://cloud.google.com/dialogflow-enterprise/docs/reference/rpc/google.cloud.dialogflow.v2#batchdeleteintentsrequest),
   *  the intents field must contains `Intent`s, but:
   *  "The collection of intents to delete. Only intent name must be filled in."
   */
  public async batchDeleteIntents(names: string[]) {
    if (names.length === 0) {
      return;
    }
    const response = await this.intentsClient.batchDeleteIntents({
      parent: this.projectAgentPath,
      intents: names.map((name: string) => ({ name })) as Intent[],
    });
    for (let name of names) {
      this.mapper.unsetName(name);
    }
    return response;
  }
}

export { IntentsService };
