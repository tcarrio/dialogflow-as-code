import _ from "lodash";
import Container from "typedi";
import { LoggerService } from "../services/logger";
import { Field, NestedDiff } from "./types";

export function nestedDiff<T extends object>(
  newt: T,
  oldt: T,
  fields?: Field[],
): NestedDiff<T> {
  const diff: NestedDiff<T> = {};
  const logger: LoggerService = Container.get(LoggerService);
  logger.verbose(`New contains: ${JSON.stringify(newt)}`);
  logger.verbose(`Old contains: ${JSON.stringify(oldt)}`);

  if (fields === undefined || fields.length === 0) {
    const tmpFields = [
      ...new Set([
        ...(newt !== undefined ? Object.keys(newt) : []),
        ...(oldt !== undefined ? Object.keys(oldt) : []),
      ]),
    ];
    logger.verbose(`Found the following fields: ${tmpFields}`);
    fields = tmpFields.map((value) => ({ value }));
  }

  if (fields.length === 0) {
    logger.verbose(`No fields found, returning empty object`);
    return {};
  }

  for (const field of fields) {
    const newField = _.get(newt, field.value);
    const oldField = _.get(oldt, field.value);
    if (newField instanceof Object || oldField instanceof Object) {
      _.set(diff, field.value, nestedDiff(newField, oldField, field.subfields));
      logger.verbose(`Recursively setting field: ${field.value}`);
    } else if (!_.isEqual(newField, oldField)) {
      _.set(diff, field.value, [newField, oldField]);
      logger.verbose(`Setting field: ${field.value}`);
    } else {
      logger.verbose(`No diff found at field: ${field.value}`);
    }
  }
  return diff;
}
