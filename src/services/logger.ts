import { Service } from "typedi";

export enum LogLevel {
  SILENT,
  NORMAL,
  VERBOSE,
}

@Service()
export class LoggerService {
  public constructor(private logLevel: LogLevel = LogLevel.SILENT) {}

  public log(value: any) {
    if (this.logLevel >= LogLevel.NORMAL) {
      console.log(value);
    }
  }

  public error(value: any) {
    console.error(value);
  }

  public verbose(value: any) {
    if (this.logLevel >= LogLevel.VERBOSE) {
      console.log(value);
    }
  }

  public passAndLog<T>(x: any): (value: T) => T {
    return (value: T) => {
      this.log(`${x} ${value}`);
      return value;
    };
  }

  public passAndError<T>(x: any): (value: T) => T {
    return (value: T) => {
      this.error(`${x} ${value}`);
      return value;
    };
  }

  public passAndVerbose<T>(x: any): (value: T) => T {
    return (value: T) => {
      this.verbose(`${x} ${value}`);
      return value;
    };
  }
}
