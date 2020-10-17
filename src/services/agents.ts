import { Service, Inject } from "typedi";
import { AgentsClient } from "dialogflow";
import { KEY_FILENAME } from "../util";

@Service()
class AgentsService {
  private agentsClients: AgentsClient;
  private projectId: string = "";

  public constructor(@Inject(KEY_FILENAME) keyFilename: string) {
    this.agentsClients = new AgentsClient({ keyFilename: keyFilename });
    this.agentsClients.getProjectId().then((projectId) => {
      this.projectId = projectId;
    });
  }

  public async getAgent(agentId: string = "") {
    if (!agentId && !this.projectId) {
      return;
    }

    return this.agentsClients.getAgent({
      parent: agentId ? agentId : this.projectId,
    });
  }
}

export { AgentsService };
