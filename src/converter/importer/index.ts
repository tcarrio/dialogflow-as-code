import { getEntityTypes } from "./types/entity-type";
import { getIntents } from "./types/intent";
import { DialogflowBundle } from "../common";

export async function importFrom(
  filePath: string = "./input",
): Promise<DialogflowBundle> {
  return Promise.all([getEntityTypes(filePath), getIntents(filePath)]).then(
    ([entityTypes, intents]) => ({ entityTypes, intents }),
  );
}
