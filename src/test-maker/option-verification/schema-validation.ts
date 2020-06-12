import { ObjectSchema } from "joi";
import { DACTestError } from "../common/dac-test-error";
import { StatusCode } from "../common/status-code";
export function isSchemaValid(schema: ObjectSchema, object: any) {
  const result = schema.validate(object);
  if (result.error)
    throw new DACTestError(result.error.message, StatusCode.INVALID_USAGE);
}
