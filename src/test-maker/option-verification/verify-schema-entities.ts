import module from "path";
import { EntityType } from "dialogflow";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
export async function verifySchemaEntities(
  directory: string,
): Promise<EntityType[]> {
  try {
    const entities: EntityType[] = [];
    const entitiesObject = await import(
      module.resolve(directory)
    );
    for (const entity in entitiesObject) {
      //TODO verify schema
      entities.push(entitiesObject[entity]);
    }
    return entities;
  } catch (e) {
    if (e instanceof DACTestError) throw e;
    else
      throw new DACTestError(
        "Could not verify schema of provided dac project (entities), have you compiled yet?",
        StatusCode.INVALID_USAGE,
      );
  }
}
