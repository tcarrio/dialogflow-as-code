import { format as _format } from "prettier";
import fs from "fs";
import { Glob } from "glob";
import { emitterToPromise } from "../importer/types/base";
import Container from "typedi";
import { LoggerService } from "../../services/logger";

let _indent = 2;
export function indent(input: string, tabs: number): string {
  if (!input) return input;

  const newIndent = new Array(tabs * _indent + 1).join(" ");
  return newIndent + input.replace(/\n/g, "\n" + newIndent);
}

export function setIndent(newIndent: number) {
  _indent = newIndent;
}

export function format(input: string): string {
  return _format(input, {});
}

export async function formatFile(filepath: string) {
  const data = _format(fs.readFileSync(filepath, null).toString(), {
    filepath,
  });
  await new Promise((res, rej) =>
    fs.writeFile(filepath, data, err => (err !== null ? rej(err) : res())),
  );
}

export async function formatDirectory(dir: string) {
  await emitterToPromise(new Glob(`${dir}/**/*.ts`)).then((matches: string[]) =>
    Promise.all(matches.map(formatFile)),
  );
  const logger: LoggerService = Container.get(LoggerService);
  logger.log("Completed formatting.");
}
