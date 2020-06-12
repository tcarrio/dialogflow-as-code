import { Service, Inject } from "typedi";
import { ContextsClient, IntentsClient, EntityTypesClient } from "dialogflow";
import { KEY_FILENAME } from "../util";

@Service()
class DialogflowService {
  @Inject(KEY_FILENAME)
  private keyFilename!: string;

  constructor() {}

  public getContextsClient(session: string, context: string): ContextsClient {
    return new ContextsClient({ keyFilename: this.keyFilename });
  }

  public getIntentsClient(): IntentsClient {
    return new IntentsClient({ keyFilename: this.keyFilename });
  }

  public getEntityTypesClient(): EntityTypesClient {
    return new EntityTypesClient({ keyFilename: this.keyFilename });
  }
}

export { DialogflowService };
