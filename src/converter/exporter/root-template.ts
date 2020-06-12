import { TemplateBundle } from "../common";
import { ENTITY_TYPE_DIR, INTENT_DIR } from "../common/globals";
import { indexTemplate } from "../templates/index-file";
import { packageJson } from "../templates/package-json";
import { tsConfig } from "../templates/ts-config";
import { serviceKey } from "../templates/service-key";

export const rootTemplate = (tpl: TemplateBundle) => {
  let entityTypeImports = "";
  let entityTypeNames = "";
  let intentImports = "";
  let intentNames = "";
  const entityTypeList = Object.keys(tpl.entityTypes);
  const intentsList = Object.keys(tpl.intents);

  entityTypeImports = `\n  ${entityTypeList.join(",\n  ")}\n`;
  entityTypeNames = `\n    ${entityTypeList.join(",\n    ")}\n`;
  intentImports = `\n  ${intentsList.join(",\n  ")}\n`;
  intentNames = `\n    ${intentsList.join(",\n    ")}\n`;

  return indexTemplate({
    entityTypes: {
      dir: ENTITY_TYPE_DIR,
      imports: entityTypeImports,
      names: entityTypeNames,
    },
    intents: {
      dir: INTENT_DIR,
      imports: intentImports,
      names: intentNames,
    },
  });
};

export const packageJsonTemplate = (config: any = {}) => {
  return packageJson();
};

export const tsconfigTemplate = (config: any = {}) => {
  return tsConfig();
};

export const serviceKeyTemplate = (config: any = {}) => {
  return serviceKey();
};
