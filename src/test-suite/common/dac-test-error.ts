import { StatusCode } from "./status-code";
export class DACTestError extends Error {
  public readonly code: StatusCode;
  public constructor(message: string, code: StatusCode) {
    super(message);
    Object.setPrototypeOf(this, DACTestError.prototype);
    this.code = code;
  }
}
