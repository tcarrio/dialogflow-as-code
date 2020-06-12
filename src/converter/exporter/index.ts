import { TemplateBundle, TemplateMap } from "../common";
import fs from "fs";
import path from "path";
import {
  rootTemplate,
  packageJsonTemplate,
  tsconfigTemplate,
} from "./root-template";
import { indexTemplate } from "./index-template";
import {
  ENTITY_TYPE_DIR,
  INTENT_DIR,
  EVENT_DIR,
  CONTEXT_DIR,
} from "../common/globals";
import Container from "typedi";
import { LoggerService } from "../../services/logger";

export async function exportTo(
  tpl: TemplateBundle,
  filePath: string = "./output",
) {
  return createDirectories(filePath)
    .then(() =>
      Promise.all([
        createEntityTypes(tpl.entityTypes, filePath),
        createIntents(tpl.intents, filePath),
        createEvents(tpl.events, filePath),
        createContexts(tpl.contexts, filePath),
        createRoot(tpl, filePath),
      ]),
    )
    .then(() =>
      Container.get<LoggerService>(LoggerService).log("Completed export."),
    );
}

async function createEntityTypes(entities: TemplateMap, filePath: string) {
  const entityDir = path.join(filePath, "src", ENTITY_TYPE_DIR);
  const promiseList: Promise<void>[] = [];
  const moduleNameList: string[] = [];
  for (let name in entities) {
    promiseList.push(
      writeFileAsPromise(entities[name], path.join(entityDir, `${name}.ts`)),
    );
    moduleNameList.push(name);
  }
  promiseList.push(
    writeFileAsPromise(
      indexTemplate(moduleNameList),
      path.join(entityDir, "index.ts"),
    ),
  );

  return Promise.all(promiseList);
}

async function createIntents(intents: TemplateMap, filePath: string) {
  const intentDir = path.join(filePath, "src", INTENT_DIR);
  const promiseList: Promise<void>[] = [];
  const moduleNameList: string[] = [];
  for (let name in intents) {
    promiseList.push(
      writeFileAsPromise(intents[name], path.join(intentDir, `${name}.ts`)),
    );
    moduleNameList.push(name);
  }
  promiseList.push(
    writeFileAsPromise(
      indexTemplate(moduleNameList),
      path.join(intentDir, "index.ts"),
    ),
  );

  return Promise.all(promiseList);
}

async function createEvents(events: string, filePath: string) {
  const eventDir = path.join(filePath, "src", EVENT_DIR);
  return writeFileAsPromise(events, path.join(eventDir, "index.ts"));
}

async function createContexts(contexts: TemplateMap, filePath: string) {
  // TODO: IMPLEMENT CONTEXT EXPORT
  const contextDir = path.join(filePath, "src", CONTEXT_DIR);
  const promiseList: Promise<void>[] = [];
  const moduleNameList: string[] = [];
  for (let name in contexts) {
    promiseList.push(
      writeFileAsPromise(contexts[name], path.join(contextDir, `${name}.ts`)),
    );
    moduleNameList.push(name);
  }
  promiseList.push(
    writeFileAsPromise(
      indexTemplate(moduleNameList),
      path.join(contextDir, "index.ts"),
    ),
  );

  return Promise.all(promiseList);
}

async function createRoot(tpl: TemplateBundle, filePath: string) {
  const promiseList: Promise<void>[] = [];
  promiseList.push(
    writeFileAsPromise(
      rootTemplate(tpl),
      path.join(filePath, "src", "index.ts"),
    ),
  );
  promiseList.push(
    writeFileAsPromise(
      packageJsonTemplate(),
      path.join(filePath, "package.json"),
    ),
  );
  promiseList.push(
    writeFileAsPromise(
      tsconfigTemplate(),
      path.join(filePath, "tsconfig.json"),
    ),
  );
  return Promise.all(promiseList);
}

async function writeFileAsPromise(data: string, filePath: string) {
  return new Promise<void>((resolve, reject) => {
    fs.writeFile(filePath, data, err => {
      return err === null ? resolve() : reject(err);
    });
  }).catch(Container.get<LoggerService>(LoggerService).error);
}

async function createDir(filePath: string): Promise<boolean> {
  return new Promise<void>((resolve, reject) => {
    fs.mkdir(filePath, null, err => {
      return err === null ? resolve() : reject(err);
    });
  })
    .catch(() =>
      Container.get<LoggerService>(LoggerService).error(
        "Directory already exists",
      ),
    )
    .then(() => true);
}

async function createDirectories(filePath: string) {
  const orderedDirectories = [
    [path.join(filePath)],
    [path.join(filePath, "src")],
    [INTENT_DIR, ENTITY_TYPE_DIR, EVENT_DIR, CONTEXT_DIR].map(d =>
      path.join(filePath, "src", d),
    ),
  ];

  try {
    for (const directories of orderedDirectories) {
      await Promise.all(directories.map(createDir));
    }
  } catch (err) {
    Container.get<LoggerService>(LoggerService).error(err);
  }
}
