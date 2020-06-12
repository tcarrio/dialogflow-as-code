import module from "path";
import { Intent } from "dialogflow";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
export async function verifySchemaIntents(
  directory: string,
): Promise<Intent[]> {
  try {
    const intents: Intent[] = [];
    const intentObject = await import(module.resolve(directory));
    console.log(intentObject);
    for (const intent in intentObject) {
      //TODO verify schema
      intents.push(intentObject[intent]);
    }
    return intents;
  } catch (e) {
    if (e instanceof DACTestError) throw e;
    else
      throw new DACTestError(
        "Could not verify schema of provided dac project (intents), this is the first checked file, have you compiled dac yet?",
        StatusCode.INVALID_USAGE,
      );
  }
}
