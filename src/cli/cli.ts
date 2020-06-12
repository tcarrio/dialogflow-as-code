#!/usr/bin/env node
import { getVersion } from "../util/version";
import program from "commander";
program
  .version(getVersion())
  .command("test [options]", "Tests intents against Dialogflow")
  .description(
    "This is a CLI for testing of Dialogflow intents, for further help vist >github<",
  )
  .command(
    "testmaker [options]",
    "Convert current dac projects to a skeleton tests.js, to get started with pipeline DAC tests.",
  )
  .option("--credits", "Shows credits for the creator of this CLI")
  .command(
    "convert [options]",
    "Generate a Dialogflow-as-Code project from a Dialogflow export",
  )
  .description("Generate a Dialogflow-as-Code project from a Dialogflow export")
  .parse(process.argv);
