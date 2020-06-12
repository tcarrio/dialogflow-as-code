import { varName } from "../../common";
import { Context } from "dialogflow";
import _ from "lodash";
import { ImportTemplate } from "./import-template";
import { TemplateProcessor } from "../template-processor";
import { CONTEXT_PREFIX } from "../../common/globals";
import { contextTemplate } from "../../templates/context";

export class ContextTemplate extends ImportTemplate
  implements TemplateProcessor {
  private interfaceName: string;
  public constructor(private context: Context) {
    super(`${CONTEXT_PREFIX}_${context.name}`);
    this.interfaceName = _.upperFirst(varName(`i_${context.name}_Context`));
  }

  public processTemplate(): string {
    const content = contextTemplate({
      context: this.context,
      interfaceName: this.interfaceName,
      variableName: this.templateVariableName(),
    });

    return content;
  }
}
