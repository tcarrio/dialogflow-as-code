import {
  DialogflowBundle,
  IntentImport,
  EntityTypeImport,
  TemplateBundle,
  TemplateMap,
} from "../common";
import _ from "lodash";
import { IntentTemplate } from "./templates/intent-template";
import { EntityTypeTemplate } from "./templates/entity-type-template";
import { EventTemplate } from "./templates/event-template";
import { ContextTemplate } from "./templates/context-template";
import { Context } from "dialogflow";

export { IntentTemplate } from "./templates/intent-template";
export { EntityTypeTemplate } from "./templates/entity-type-template";

export function convert(bundle: DialogflowBundle): TemplateBundle {
  const entityTypes = _.reduce(bundle.entityTypes, mergeEntityType, {});
  const intents = _.reduce(bundle.intents, mergeIntent, {});
  const events = new EventTemplate().processTemplate();
  const contexts = _.reduce(bundle.intents, mergeContext, {});
  return { entityTypes, intents, events, contexts };
}

function mergeIntent(previous: any, importObj: IntentImport): TemplateMap {
  const intentTemplate = new IntentTemplate(importObj);
  return _.merge(previous, {
    [intentTemplate.templateVariableName()]: intentTemplate.processTemplate(),
  });
}

function mergeEntityType(
  previous: any,
  importObj: EntityTypeImport,
): TemplateMap {
  const entityTypeTemplate = new EntityTypeTemplate(importObj);
  return _.merge(previous, {
    [entityTypeTemplate.templateVariableName()]: entityTypeTemplate.processTemplate(),
  });
}

function mergeContext(previous: any, importObj: IntentImport): TemplateMap {
  const contextTemplates: Context[] = [];
  contextTemplates.push(
    ..._.chain(importObj.responses)
      .filter(r => r.affectedContexts.length > 0)
      .map(r => r.affectedContexts)
      .flatten()
      .filter(ctx => ctx.name !== undefined)
      .value(),
  );

  contextTemplates.push(
    ..._.chain(importObj.contexts)
      .filter(c => c !== undefined && c !== null)
      .map(c => ({ name: c, lifespan: 5 }))
      .value(),
  );

  return _.reduce(
    _.uniqBy(contextTemplates, "name"),
    (prevMap, ctx) => {
      const ctxTpl = new ContextTemplate(ctx);
      return _.merge(prevMap, {
        [ctxTpl.templateVariableName()]: ctxTpl.processTemplate(),
      });
    },
    previous,
  );
}

export const COMMA_NEWLINE = ",\n";
