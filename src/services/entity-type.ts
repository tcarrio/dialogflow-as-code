// https://cloud.google.com/dialogflow-enterprise/docs/reference/rpc/google.cloud.dialogflow.v2#google.cloud.dialogflow.v2.EntityType

import {
  BatchDeleteEntityTypesRequest,
  CreateEntityTypeRequest,
  DeleteEntityTypeRequest,
  EntityType,
  EntityTypesClient,
  GetEntityTypeRequest,
  ListEntityTypesRequest,
  UpdateEntityTypeRequest,
} from "dialogflow";
import _ from "lodash";
import { Inject, Service } from "typedi";
import { DialogflowServiceAccount } from "../config";
import { DIALOGFLOW_CONFIG, processGrpc } from "../util";
import { LoggerService } from "./logger";

export const DEFAULT_ENTITY_TYPE = {
  displayName: "",
  entities: [],
  kind: "KIND_LIST" as any,
  autoExpansionMode: "AUTO_EXPANSION_MODE_UNSPECIFIED" as any,
};

@Service()
class EntityTypeService {
  private entityTypesClient: EntityTypesClient;
  private projectAgentPath: string;

  public constructor(
    @Inject(DIALOGFLOW_CONFIG) svcAcctConfig: DialogflowServiceAccount,
    @Inject(() => LoggerService) private logger: LoggerService,
  ) {
    this.entityTypesClient = new EntityTypesClient({
      credentials: svcAcctConfig,
    });
    this.projectAgentPath = this.entityTypesClient.projectAgentPath(
      svcAcctConfig.project_id,
    );
  }

  public async getEntityType(name: string): Promise<EntityType> {
    const getEntityTypeRequest: GetEntityTypeRequest = { name };

    return processGrpc(
      this.entityTypesClient.getEntityType(getEntityTypeRequest),
      "getEntityType",
    );
  }

  public async getEntityTypeByDisplayName(
    displayName: string,
  ): Promise<EntityType | null> {
    return this.getEntityTypes()
      .then((entities) => {
        const matches = entities.filter(
          (entity) => entity.displayName === displayName,
        );
        if (matches.length === 1) {
          return matches[0];
        }
        return null;
      })
      .catch((err) => {
        throw err;
      });
  }

  public async createEntityType(entity: EntityType): Promise<EntityType> {
    const request: CreateEntityTypeRequest = {
      parent: this.projectAgentPath,
      entityType: this.populateEntityType(entity),
    };

    return processGrpc(
      this.entityTypesClient.createEntityType(request),
      "createEntityType",
    );
  }

  private populateEntityType(options: EntityType): EntityType {
    return {
      ...DEFAULT_ENTITY_TYPE,
      ...options,
    };
  }

  public async getEntityTypes(): Promise<EntityType[]> {
    const listEntityTypeRequest: ListEntityTypesRequest = {
      parent: this.projectAgentPath,
    };

    return processGrpc(
      this.entityTypesClient.listEntityTypes(listEntityTypeRequest),
      "getEntityTypes",
    );
  }

  public async updateEntityType(
    name: string,
    entityType: EntityType,
  ): Promise<EntityType> {
    const updateEntityTypeRequest: UpdateEntityTypeRequest = { entityType };

    return processGrpc(
      this.entityTypesClient.updateEntityType(updateEntityTypeRequest),
      "updateEntityType",
    );
  }

  public async updateEntityTypeByDisplayName(
    displayName: string,
    entityType: EntityType,
  ) {
    const entity = await this.getEntityTypeByDisplayName(displayName);

    if (entity === null || entity.name === null) {
      return null;
    }
    const updateEntityTypeRequest: UpdateEntityTypeRequest = {
      entityType: {
        name: entity.name!,
        ...entityType,
      },
    };

    return this.entityTypesClient.updateEntityType(updateEntityTypeRequest);
  }

  public async batchCreateEntityTypes(entities: EntityType[]) {
    return this.batchUpdateEntityTypes(entities, false);
  }

  public async batchUpdateEntityTypes(
    entities: EntityType[],
    isUpdate: boolean = true,
  ) {
    entities = entities.map(this.populateEntityType);

    if (isUpdate && _.some(entities, ["name", undefined])) {
      return this.batchUpdateEntityTypesByDisplayName(entities, isUpdate);
    }

    return this.entityTypesClient.batchUpdateEntityTypes({
      parent: this.projectAgentPath,
      entityTypeBatchInline: {
        entityTypes: entities,
      },
    });
  }

  public async batchUpdateEntityTypesByDisplayName(
    entities: EntityType[],
    isUpdate: boolean = true,
  ) {
    const currentEntitiesAsync = this.getEntityTypes();

    const missingEntities: string[] = [];
    const entityMap: EntityMap = entities.reduce(
      (previous: EntityMap, entity: EntityType) => {
        previous[entity.displayName] = entity;
        return previous;
      },
      {},
    );

    const currentEntities = await currentEntitiesAsync;
    const currentEntityMap: EntityMap = currentEntities.reduce(
      (previous: EntityMap, entity: EntityType) => {
        previous[entity.displayName] = entity;
        return previous;
      },
      {},
    );

    for (let displayName of Object.keys(entityMap)) {
      if (displayName in currentEntityMap) {
        entityMap[displayName].name = currentEntityMap[displayName].name;
      } else {
        missingEntities.push(displayName);
      }
    }

    if (isUpdate && missingEntities.length > 0) {
      throw new Error(
        `Entities cannot be resolved to unique ID: ${JSON.stringify(
          missingEntities,
        )}`,
      );
    }

    return this.entityTypesClient.batchUpdateEntityTypes({
      parent: this.projectAgentPath,
      entityTypeBatchInline: {
        entityTypes: entities,
      },
    });
  }

  public async deleteEntityType(name: string) {
    const deleteEntityTypeRequest: DeleteEntityTypeRequest = { name };

    return this.entityTypesClient.deleteEntityType(deleteEntityTypeRequest);
  }

  public async deleteEntityTypeByDisplayName(displayName: string) {
    const entity = await this.getEntityTypeByDisplayName(displayName);

    if (entity === null || entity.name === null) {
      this.logger.error("No matching entity found");
      return null;
    }
    const deleteEntityTypeRequest: DeleteEntityTypeRequest = {
      name: entity.name!,
    };

    return this.entityTypesClient.deleteEntityType(deleteEntityTypeRequest);
  }

  public async batchDeleteEntityTypes(names: string[]) {
    if (names.length === 0) {
      return;
    }

    const request: BatchDeleteEntityTypesRequest = {
      parent: this.projectAgentPath,
      entityTypeNames: names,
    };

    return processGrpc(
      this.entityTypesClient.batchDeleteEntityTypes(request),
      "batchDeleteEntityTypes",
    );
  }

  public async batchDeleteEntityTypesByDisplayNames(displayNames: string[]) {
    const currentEntitiesAsync = this.getEntityTypes();

    const displayNameSet = new Set<string>(displayNames);
    const names: string[] = [];
    const invalidNames: string[] = [];

    const currentEntities = await currentEntitiesAsync;
    for (let entity of currentEntities) {
      if (displayNameSet.has(entity.displayName)) {
        names.push(entity.displayName);
      } else {
        invalidNames.push(entity.displayName);
      }
    }

    if (invalidNames.length > 0) {
      throw new Error(
        `Invalid displayNames provided: ${JSON.stringify(invalidNames)}`,
      );
    }

    return this.batchDeleteEntityTypes(names);
  }
}

interface EntityMap {
  [displayName: string]: EntityType;
}

export { EntityTypeService };
