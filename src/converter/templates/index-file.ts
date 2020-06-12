import _ from "lodash";

interface Options {
  entityTypes: Importer;
  intents: Importer;
}

interface Importer {
  imports: string;
  dir: string;
  names: string;
}

export const indexTemplate = (opts: Options) => {
  return template(opts);
};

const content = `import "reflect-metadata";
import { Container } from 'typedi';

import { 
  DialogflowServiceAccount,
  DialogflowBuilder,
  DialogflowCreator,
  KEY_FILENAME, 
  DIALOGFLOW_CONFIG,
} from "@0xc/dialogflow-as-code";

import {<%= entityTypes.imports %>} from "./<%= entityTypes.dir %>";
import {<%= intents.imports %>} from "./<%= intents.dir %>";

async function main() {
  const accountKey: string = "./service-account-key.json"

  const keyFile: string = accountKey;
  Container.set(KEY_FILENAME, keyFile);

  const config: DialogflowServiceAccount = require("." + accountKey);
  Container.set(DIALOGFLOW_CONFIG, config);

  const resources = new DialogflowBuilder()
  .ets([<%= entityTypes.names %>])
  .its([<%= intents.names %>])
  .build()

  const dfc = Container.get(DialogflowCreator);
  await dfc.sync(resources);
}

main();
`;
const template = _.template(content);
