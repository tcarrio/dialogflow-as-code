import {
  emitterToPromise,
  filterGlobs,
  parseAs,
  DEFAULT_PARSE_OPTS,
} from "./base";
import { EntityTypeImport, EntityDefImport } from "../../common";

import { EventEmitter } from "events";
import { Glob } from "glob";
import path from "path";
import { Entity } from "dialogflow";
import { ENTITY_TYPE_DIR } from "../../common/globals";

const ENTITIES_ENTRIES_REGEX = /^.+\/(.+)_entries_..\.json$/;

export async function getEntityTypes(
  filePath: string,
): Promise<EntityTypeImport[]> {
  const entityEmitter: EventEmitter = new Glob(
    `${filePath}/${ENTITY_TYPE_DIR}/*.json`,
  );
  const entityEntSet: Set<string> = new Set([]);
  const entityDefSet: Set<string> = new Set([]);

  return emitterToPromise(entityEmitter)
    .then(filterGlobs(entityEntSet, entityDefSet, ENTITIES_ENTRIES_REGEX))
    .then(loadEntitiesByName(filePath));
}

function loadEntitiesByName(filePath: string) {
  return (entityNames: string[]) => {
    return entityNames.map(name =>
      importEntity(`${filePath}/${ENTITY_TYPE_DIR}`, name),
    );
  };
}

function importEntity(filePath: string, name: string): EntityTypeImport {
  const definitionMatch = path.join(filePath, `${name}.json`);
  const entityDefinition = parseAs<EntityDefImport>(definitionMatch);

  const entitiesMatch = path.join(filePath, `${name}_entries_en.json`);
  const entities = parseAs<Entity[]>(entitiesMatch, {
    ...DEFAULT_PARSE_OPTS,
    defaultVal: [],
  });

  const entityType: EntityTypeImport = { ...entityDefinition, entities };

  return entityType;
}
