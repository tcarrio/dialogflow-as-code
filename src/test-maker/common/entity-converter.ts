import { Part, EntityType } from "dialogflow";
import { NumberSynonym } from "../entity-tables/number-table";

export function entityConverter(entity: Part, entities: EntityType[]): string {
  //converts a part into an appropriate string
  const defaultEntity = entity.text.match(/@(.*):.*/);
  const matched = defaultEntity
    ? entities.find(
        x => x.displayName === defaultEntity[1] && x.kind === "KIND_MAP",
      )
    : entities.find(
        x => x.displayName === entity.alias && x.kind === "KIND_MAP",
      );
  if (matched) {
    return matched.entities[
      Math.floor(Math.random() * Math.floor(matched.entities.length - 0.01))
    ].value;
  }
  if (entity.entityType === "@sys.number") {
    const item = Math.floor(Math.random() * (NumberSynonym.length - 0.01)) + 0;
    return NumberSynonym[item];
  }
  return entity.text;
}
