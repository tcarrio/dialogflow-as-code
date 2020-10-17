import { Context, EntityType, Intent } from "dialogflow";
import _ from "lodash";
import { Service } from "typedi";
import { Dialogflow } from "../builder";
import { diffIntents, NestedDiff } from "../diff";
import {
  ContextService,
  EntityTypeService,
  IntentsService,
  MappingService,
} from "../services";
import { LoggerService } from "../services/logger";
import { ResourceStage } from "./stage";

@Service()
export class DialogflowCreator {
  // log returns input so can be used as logging middleware in promises
  private _intentNameRegex: RegExp = /^projects\/\w+-\w+\/agent\/intents\/w+$/;

  public constructor(
    private intentsService: IntentsService,
    private entityTypesService: EntityTypeService,
    private contextsService: ContextService,
    private mapper: MappingService,
    private logger: LoggerService,
  ) {}

  public async sync(df: Dialogflow) {
    try {
      await this.generateJSONAndUploadZip();

      const inst: DialogflowInstructions = await this.sortResources(df);

      this.logger.verbose(`instructions: ${inst}`);

      await this.entityTypeCreation(inst);
      await this.entityTypeUpdate(inst);
      await this.parentIntentCreate(inst);
      await this.followupIntentCreation(inst);
      await this.parentIntentUpdate(inst);
      await this.followupIntentUpdate(inst);
      await this.intentDeletion(inst);
      await this.delayForTraining(inst);
      await this.entityTypeDeletion(inst);

      this.logger.log("Dialogflow resources successfully synchronized");
    } catch (err) {
      this.logger.error(`Error encountered during sync: ${err}`);
      process.exit(1);
    }
  }

  private async updateCache() {
    await this.intentsService.getIntents();
  }

  @ResourceStage("Entity Type Creation")
  private async entityTypeCreation(inst: DialogflowInstructions) {
    const operations = inst.entityTypes.create;

    if (operations.length === 0) {
      return;
    }

    await this.entityTypesService.batchCreateEntityTypes(operations);
  }

  @ResourceStage("Entity Type Update")
  private async entityTypeUpdate(inst: DialogflowInstructions) {
    const operations = inst.entityTypes.update;

    if (operations.length === 0) {
      return;
    }

    await this.entityTypesService.batchUpdateEntityTypes(operations);
  }

  @ResourceStage("Parent Intent Creation")
  private async parentIntentCreate(inst: DialogflowInstructions) {
    const operations = _.chain(inst.intents.create)
      .filter((i) => i.parentFollowupIntentName === undefined)
      .value();

    if (operations.length === 0) {
      return;
    }

    await this.intentsService.batchCreateIntents(operations);
  }

  @ResourceStage("Follow-Up Intent Creation")
  private async followupIntentCreation(inst: DialogflowInstructions) {
    await this.updateCache();

    const operations = _.chain(inst.intents.create)
      .filter((i) => i.parentFollowupIntentName !== undefined)
      .map((i) =>
        this.mapFollowupParentNames(i, this.intentsService, this.mapper),
      )
      .value();

    if (operations.length === 0) {
      return;
    }

    await this.intentsService.batchCreateIntents(operations);
  }

  @ResourceStage("Parent Intent Update")
  private async parentIntentUpdate(inst: DialogflowInstructions) {
    const operations = _.chain(inst.intents.update)
      .filter((i) => i.parentFollowupIntentName === undefined)
      .value();

    if (operations.length === 0) {
      return;
    }

    await this.intentsService.batchUpdateIntents(operations);
  }

  @ResourceStage("Follow-Up Intent Update")
  private async followupIntentUpdate(inst: DialogflowInstructions) {
    await this.updateCache();

    const operations = _.chain(inst.intents.update)
      .filter((i) => i.parentFollowupIntentName !== undefined)
      .map((i) =>
        this.mapFollowupParentNames(i, this.intentsService, this.mapper),
      )
      .value();

    if (operations.length === 0) {
      return;
    }

    await this.intentsService.batchUpdateIntents(operations);
  }

  @ResourceStage("Intent Deletion")
  private async intentDeletion(inst: DialogflowInstructions) {
    const operations = inst.intents.delete;

    if (operations.length === 0) {
      return;
    }

    await this.intentsService.batchDeleteIntents(
      operations.map((i) => i.name!),
    );
  }

  private async delayForTraining(inst: DialogflowInstructions) {
    // TODO: Implement based on training completion
    const delayAmount = calculateDelay(inst);
    if (delayAmount > 0) {
      return this.delay(delayAmount);
    }
  }

  private async delay(
    ms: number,
    message: string = "before deleting entity types...",
  ) {
    return new Promise((res, _rej) => {
      this.logger.log(`Waiting ${ms}ms ${message}`);
      setTimeout(res, ms);
    });
  }

  @ResourceStage("Entity Type Deletion")
  private async entityTypeDeletion(inst: DialogflowInstructions) {
    await this.entityTypesService.batchDeleteEntityTypes(
      inst.entityTypes.delete.map((e) => e.name!),
    );
  }

  private mapFollowupParentNames(
    intent: Intent,
    svc: IntentsService,
    map: MappingService,
  ): Intent {
    this.logger.verbose(`Mapping followup: ${JSON.stringify(intent, null, 2)}`);

    if (
      intent.parentFollowupIntentName &&
      intent.parentFollowupIntentName.match(this._intentNameRegex) !== null
    ) {
      return intent;
    }

    const name = map.getName(intent.parentFollowupIntentName!);
    if (name !== null) {
      this.logger.verbose(`input: ${intent.displayName}; output: ${name}`);
      intent.parentFollowupIntentName = name;
    } else {
      throw new Error(
        `No intent found by display name: ${intent.parentFollowupIntentName}`,
      );
    }
    return intent;
  }

  private mapIntentsContexts(intents: Intent[]): Intent[] {
    return intents.map((intent) => {
      return {
        ...intent,
        outputContexts: intent.outputContexts!.map((ctx) => {
          return { ...ctx, name: this.contextInPath(ctx.name!) };
        }),
        inputContextNames: intent.inputContextNames!.map((name) =>
          this.contextInPath(name),
        ),
      };
    });
  }

  private contextInPath(name: string): string {
    // projects/example-44ee3/agent/sessions/-/contexts/fruit-context
    return `${this.contextsService.getSessionPath()}/contexts/${name}`;
  }

  private async sortResources(df: Dialogflow): Promise<DialogflowInstructions> {
    return Promise.all([
      this.intentsService.getIntents(),
      this.entityTypesService.getEntityTypes(),
      this.contextsService.getContexts(),
    ])
      .then(this.logger.passAndVerbose("service response: "))
      .then(([existingIntents, existingEntities, contexts]) => {
        const instructions: DialogflowInstructions = {
          intents: this.filterBy<Intent>(
            df.intents,
            existingIntents,
            "displayName",
            ["name"],
          ),
          entityTypes: this.filterBy<EntityType>(
            df.entityTypes,
            existingEntities,
            "displayName",
            ["name"],
          ),
          contexts: this.filterBy<Context>(df.contexts, contexts, "N/A"),
        };

        // Apply transformations for contexts to have session path
        instructions.intents.create = this.mapIntentsContexts(
          instructions.intents.create,
        );
        instructions.intents.update = this.mapIntentsContexts(
          instructions.intents.update,
        );

        // Generate diff of intents
        instructions.diff = diffIntents(
          instructions.intents.update,
          existingIntents,
        );
        this.logger.log(
          `Intent Diff:\n${JSON.stringify(instructions.diff, null, 2)}`,
        );
        return instructions;
      })
      .then(this.logger.passAndVerbose("filtered response: "));
  }

  private filterBy<T>(
    col1: T[],
    col2: T[],
    field: string,
    fields: string[] = [],
  ): ResourceInstruction<T> {
    return {
      create: _.differenceBy(col1, col2, field),
      update: this.updatedBy(col1, col2, field, fields),
      delete: _.differenceBy(col2, col1, field),
    };
  }

  private async generateJSONAndUploadZip() {
    // TODO: Implement project builder
  }

  private updatedBy<T>(
    col1: T[],
    col2: T[],
    id: string,
    fields: string[],
  ): T[] {
    const index: { [k: string]: [any, any] } = {}; // [OLD, NEW]
    const matches: string[] = [];

    col1.forEach((v: { [k: string]: any }) => (index[v[id]] = [null, v]));
    col2.forEach((v: { [k: string]: any }) => {
      if (index[v[id]] !== undefined) {
        matches.push(v[id]);
        index[v[id]][0] = _.reduce(
          fields,
          (obj, field) => _.merge(obj, { [field]: v[field] }),
          {},
        );
      }
    });

    return matches.map((name: string) => _.merge(...index[name]));
  }
}

function calculateDelay(inst: DialogflowInstructions): number {
  return (
    125 *
    (inst.intents.create.length +
      inst.intents.update.length +
      inst.entityTypes.create.length +
      inst.entityTypes.update.length +
      inst.intents.delete.length) *
    Number(inst.entityTypes.delete.length !== 0)
  );
}

interface ResourceInstruction<T> {
  create: T[];
  update: T[];
  delete: T[];
}

interface DialogflowInstructions {
  intents: ResourceInstruction<Intent>;
  entityTypes: ResourceInstruction<EntityType>;
  contexts: ResourceInstruction<Context>;
  diff?: NestedDiff<Intent>[];
}
