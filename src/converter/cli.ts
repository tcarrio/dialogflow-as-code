#!/usr/bin/env node

import { importFrom } from "./importer";
import { convert } from "./converter";
import { exportTo } from "./exporter";

import { Command } from "commander";
import { formatDirectory } from "./common";
import { getVersion } from "../util/version";

async function main(inputDirectory: string, outputDirectory: string) {
  const imported = await importFrom(inputDirectory);
  const converted = convert(imported);
  await exportTo(converted, outputDirectory);
  formatDirectory(outputDirectory);
}

function buildProgram() {
  const program = new Command("dialogflow-as-code");

  program
    .version(getVersion())
    .description(
      "Generate a Dialogflow-as-Code project from a Dialogflow export",
    )
    .usage("[options]")
    .option("-o, --output <dir>", "Output directory (default: ./output)")
    .option("-i, --input <dir>", "Input directory (default: ./input)")
    .parse(process.argv);

  return program;
}

const CLI = buildProgram();

let outputDirectory: string = "./output";
if (CLI.output) outputDirectory = CLI.output;

let inputDirectory: string = "./input";
if (CLI.input) inputDirectory = CLI.input;

main(inputDirectory, outputDirectory);
