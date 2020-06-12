import { DACTestError } from "./dac-test-error";

export enum LogLevel {
  SILENT,
  NORMAL,
  VERBOSE,
}
export class Logger {
  constructor(private logLevel: LogLevel = LogLevel.NORMAL) {}
  public setLevel(logLevel: LogLevel): void {
    this.logLevel = logLevel;
  }
  public log(message: string): void {
    if (this.logLevel >= LogLevel.NORMAL) {
      console.log(message);
    }
  }
  public verbose(message: string): void {
    if (this.logLevel >= LogLevel.VERBOSE) {
      console.log(message);
    }
  }
  public error(err: Error | string | DACTestError): void {
    if (err instanceof DACTestError) {
      console.error(err.message);
    } else {
      console.error(err);
    }
  }
}
