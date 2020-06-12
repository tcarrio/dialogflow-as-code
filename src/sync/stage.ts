import Container from "typedi";
import { LoggerService } from "../services/logger";

export function ResourceStage(name: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const logger: LoggerService = Container.get(LoggerService);
    const originalFunction = descriptor.value;
    descriptor.value = async function(...args: any) {
      logger.log(`Started phase: ${name}`);
      await originalFunction.apply(this, args);
      logger.log(`Successfully completed phase: ${name}`);
    };
  };
}
