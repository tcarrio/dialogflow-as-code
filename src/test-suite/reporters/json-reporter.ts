import { Reporter } from "../common-interfaces/cli-interfaces";
import { TestResults } from "../common-interfaces/data-interfaces";
import fs from "fs";
import module from "path";
import { Logger } from "../common/logger";
export class JSONReporter implements Reporter {
  private data: TestResults[] = [];
  private path: string;
  public constructor(path: string) {
    this.path = path;
  }
  public formatData(data: TestResults[]):void {
    this.data = data;
  }
  public activateReport(logger: Logger):void {
    logger.verbose("JSON Written to: " + module.resolve(this.path));
    fs.writeFileSync(module.resolve(this.path), JSON.stringify(this.data));
  }
}
