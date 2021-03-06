import { Context, ContextsClient } from "dialogflow";
import { Inject, Service } from "typedi";
import { DialogflowServiceAccount } from "../config";
import { DIALOGFLOW_CONFIG } from "../util";

@Service()
class ContextService {
  private contextsClient: ContextsClient;
  private sessionPath: string;
  // private contextPath: string;

  public constructor(
    @Inject(DIALOGFLOW_CONFIG) private svcAcctConfig: DialogflowServiceAccount,
  ) {
    this.contextsClient = new ContextsClient({ credentials: svcAcctConfig });
    this.sessionPath = this.contextsClient.sessionPath(
      svcAcctConfig.project_id,
      "-",
    );
    // this.contextPath = this.contextsClient.contextPath(svcAcctConfig.project_id, session, context);
  }

  // TODO: Implement contexts if necessary
  public async getContexts(): Promise<Context[]> {
    return [];
  }

  public getSessionPath() {
    return this.sessionPath;
  }

  public setSessionPath(sessionName: string = "-") {
    this.sessionPath = this.contextsClient.sessionPath(
      this.svcAcctConfig.project_id,
      sessionName,
    );
  }
}

export { ContextService };
