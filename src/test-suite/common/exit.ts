import { StatusCode } from "./status-code";
export function exit(code: StatusCode): void {
  process.exit(code);
}
