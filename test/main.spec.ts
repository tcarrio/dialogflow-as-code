import { DialogflowBundle } from "../src/converter/common";
import { importFrom } from "../src/converter/importer";
import { convert } from "../src/converter/converter";
import { exportTo } from "../src/converter/exporter";

import { apdexEntity } from "./resources/entities/apdex";
import { apdexAppIntent } from "./resources/intents/apdexApp";

import path from "path";
import fs from "fs";

const resourceRoot = path.join(__dirname, "resources");
const intentFileName = "ntDavisApdexApp";

describe("Dialogflow Importer", () => {
  it("parses the files from a provided directory", async () => {
    const bundle: DialogflowBundle = await importFrom(resourceRoot);

    expect(bundle.intents).toHaveLength(1);
    expect(bundle.intents[0]).toMatchObject(apdexAppIntent);

    expect(bundle.entityTypes).toHaveLength(1);
    expect(bundle.entityTypes[0]).toMatchObject(apdexEntity);
  });
});

describe("Dialogflow Converter", () => {
  it("creates a string from a resource", async () => {
    let bundle: DialogflowBundle = await importFrom(resourceRoot);

    let templates = convert(bundle);

    const apdexIntent = templates.intents[intentFileName];

    // variable is generated
    expect(
      apdexIntent.indexOf(`const ${intentFileName}`),
    ).toBeGreaterThanOrEqual(0);

    // module is imported
    expect(
      apdexIntent.indexOf("@0xc/dialogflow-as-code"),
    ).toBeGreaterThanOrEqual(0);

    // correct part builder syntax
    expect(
      apdexIntent.indexOf('pb("application")'),
    ).toBeGreaterThanOrEqual(0);

    // correct default entity type syntax
    expect(apdexIntent.indexOf('det("date-time")')).toBeGreaterThanOrEqual(0);
  });
});

describe("Dialogflow Exporter", () => {
  it("should generate an output file", async () => {
    const testOutputDir = `${resourceRoot}/testOutput`;
    const testIntentsDir = `${testOutputDir}/src/intents`;
    const testIntentFile = `${testIntentsDir}/${intentFileName}.ts`;
    const testIntentIndex = `${testIntentsDir}/index.ts`;

    await importFrom(resourceRoot)
      .then(convert)
      .then(tpl => exportTo(tpl, testOutputDir))
      .catch()
      .then(timer(1000))
      .then(() =>
        Promise.all([
          checkFileExists(testIntentFile),
          checkFileExists(testIntentIndex),
        ]),
      )
      .then(([res1, res2]) => {
        expect(res1).toBeTruthy();
        expect(res2).toBeTruthy();
      })
      .catch(fail);
  });
});

async function checkFileExists(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, null, e => (e === null ? resolve(true) : reject()));
  });
}

function timer(ms: number) {
  return () => new Promise((res, rej) => setTimeout(() => res(), ms));
}

function fail(reason: any) {
  console.error(JSON.stringify(reason, null, 2));
  expect(1).toEqual(0);
}
