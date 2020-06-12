import { EventEmitter } from "events";
import fs from "fs";

const DEFAULT_NAME_REGEX = /^.+\/(.+)\.json$/;

export function filterGlobs(
  valuesSet: Set<string>,
  defaultSet: Set<string>,
  regex: RegExp,
): MatchFilter {
  return (matches: string[]) => {
    matches.forEach(m => {
      let rex: RegExpMatchArray | null;
      rex = m.match(regex);
      if (rex !== null && rex.length > 1) {
        valuesSet.add(rex[1]);
        return;
      }

      rex = m.match(DEFAULT_NAME_REGEX);
      if (rex !== null && rex.length > 1) {
        defaultSet.add(rex[1]);
      }
    });

    return [...defaultSet];
  };
}

export function emitterToPromise<T = string[]>(
  emitter: EventEmitter,
): Promise<T> {
  return new Promise<T>((res, rej) => {
    emitter.on("end", res);
    emitter.on("error", rej);
  });
}

interface ParseOptions<T> {
  encoding: string;
  defaultVal?: T;
}

export const DEFAULT_PARSE_OPTS = { encoding: "utf-8" };

export function parseAs<T>(
  fileName: string,
  opts: ParseOptions<T> = { encoding: "utf-8" },
): T {
  try {
    return JSON.parse(fs.readFileSync(fileName, opts.encoding));
  } catch (err) {
    if (opts.defaultVal !== undefined) {
      return opts.defaultVal;
    } else {
      throw err;
    }
  }
}

interface MatchFilter {
  (matches: string[]): string[];
}
