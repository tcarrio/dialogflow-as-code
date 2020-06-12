import {
  IntentImport,
  TrainingPhrase,
  Response,
  PartImport,
  getVar,
  getVars,
  varName,
} from "../../common";
import { COMMA_NEWLINE } from "..";
import { ImportTemplate } from "./import-template";
import { TemplateProcessor } from "../template-processor";
import {
  ENTITY_TYPE_DIR,
  INTENT_PREFIX,
  ENTITY_PREFIX,
  EVENT_DIR,
} from "../../common/globals";
import { processEvent } from "./event-template";
import { Context, Parameter } from "dialogflow";
import { indent } from "../../common";
import { intentNameRegex } from "../../../util";
import { getIntentName } from "../../common/mapper";

enum PartType {
  SystemGenerated,
  UserGenerated,
  String,
}

export class IntentTemplate extends ImportTemplate
  implements TemplateProcessor {
  private _inputContexts: Set<string> = new Set([]);
  private _outputContexts: Set<Context> = new Set([]);
  private _usedEntities: Set<string> = new Set([]);
  private cxPre: string = "cx_";

  public constructor(private intent: IntentImport) {
    super(`${INTENT_PREFIX}_${intent.name}`);
  }

  public processTemplate(): string {
    this.addImport("intent");
    const processedIntent = `import { Intent } from 'dialogflow';
${this.templateEntityImports()}

const ${this.templateVariableName()}: Intent =
  intent("${this.intent.name}")
  .priority(${this.intent.priority})
  .webhook(${this.intent.webhookUsed})
  .trainingPhrases([
${indent(this.templatePhrases(), 2)}
  ])
${indent(this.templateResponses(), 2)}
  .events([
${indent(this.templateEvents(), 2)}
  ])
  .outputContexts([
${indent(this.templateOutputContexts(), 2)}
  ])
  .inputContexts([
${indent(this.templateInputContexts(), 2)}
  ])
  .parameters([
${indent(this.templateParameters(), 2)}
  ])
${indent(this.templateFollowUp(), 1)}
  .build();

export { ${this.templateVariableName()} };
`;

    return [this.templateImports(), processedIntent].join("");
  }

  private templateEntityImports(): string {
    const imports = getVars().filter(n => this._usedEntities.has(n));
    return imports.length > 0
      ? `import { ${imports.join(", ")} } from '../${ENTITY_TYPE_DIR}';\n`
      : "";
  }

  private templateFollowUp(): string {
    if (!this.intent.parentId) {
      return "";
    }
    let name = getIntentName(this.intent.parentId);
    if (this.intent.parentId.match(intentNameRegex) || name) {
      if (name) {
        name = varName(name, `${INTENT_PREFIX}_`);
      } else {
        const parts = this.intent.parentId.split("/");
        name = varName(parts[parts.length - 1], `${INTENT_PREFIX}_`);
      }
      this.addImport(name, `./${name}`);
      return `.followUpOf(${name}.displayName)`;
    } else {
      return `.followUpOf("${this.intent.parentId}")`;
    }
  }

  private templateParameters(): string {
    const params: Parameter[] = [];
    for (let response of this.intent.responses) {
      for (let param of response.parameters) {
        const newParam: Parameter = {
          displayName: param.name,
        };
        if (param.dataType) newParam.entityTypeDisplayName = param.dataType;
        if (param.isList) newParam.isList = param.isList;
        if (param.prompts) newParam.prompts = param.prompts.map(p => p.value);
        if (param.required) newParam.mandatory = param.required;
        if (param.value) newParam.value = param.value;
        params.push(newParam);
      }
    }
    return params.map(IntentTemplate.templateParameter).join(",\n");
  }

  public static templateParameter(param: Parameter) {
    return JSON.stringify(param, null, 2);
    // TODO: Implement builder?
  }

  private templatePhrases(): string {
    this.includeEntityImports();
    const tps = this.intent.trainingPhrases
      .map(IntentTemplate.templatePhrase)
      .join(COMMA_NEWLINE)
      .toString();

    this.addImport("tp");
    for (let im of IntentTemplate.checkAndAdd(tps, ["det", "pb"])) {
      this.addImport(im);
    }
    return tps;
  }

  public static templatePhrase(phrase: TrainingPhrase): string {
    return `tp([${phrase.data.map(IntentTemplate.templatePart).toString()}])`;
  }

  public static templatePart(part: PartImport): string {
    switch (IntentTemplate.typeOfPart(part)) {
      case PartType.SystemGenerated:
        return `det("${part.meta.substr(5)}")`;
      case PartType.UserGenerated:
        const name = part.meta.substr(1);
        const varName = getVar(`${ENTITY_PREFIX}_${name}`);
        if (varName !== null) {
          return `pb(${varName})`;
        }
        return `pb("${name}")`;
      default:
        return `"${part.text.trim()}"`;
    }
  }

  public static typeOfPart(part: PartImport): PartType {
    if (part.meta !== undefined && part.meta !== null) {
      if (part.meta.substr(0, 4) === "@sys") {
        return PartType.SystemGenerated;
      }
      return PartType.UserGenerated;
    }
    return PartType.String;
  }

  public static checkAndAdd(str: string, checks: string[]): string[] {
    return checks.filter(val => str.indexOf(`${val}(`) > -1);
  }

  private templateEvents(): string {
    if (this.intent.events.length > 0) {
      this.addImport("Event", `../${EVENT_DIR}`);
      return this.intent.events
        .map(event => `Event.${processEvent(event.name)}`)
        .toString();
    }
    return "";
  }

  private templateResponses(): string {
    let result = this.intent.responses
      .map(res => `.messages([\n  ${this.templateMessage(res)}\n])`)
      .filter(msg => !!msg)
      .join("\n");
    return result;
  }

  private templateMessage(res: Response): string {
    const messages = res.messages
      .filter(msg => msg.speech !== undefined && msg.speech.length > 0)
      .map(msg => {
        return `msg("${this.messageTypeFrom(
          msg.type,
        )}").set(${IntentTemplate.processSpeech(msg.speech)}),`;
      });

    if (messages.length > 0) {
      this.addImport("msg");
      return messages.join(COMMA_NEWLINE);
    }
    return "";
  }

  public static processSpeech(speech: string | string[]) {
    const val = isStringArray ? speech : [speech];
    return JSON.stringify(val);
  }

  private messageTypeFrom(msgType: number = 0): string {
    switch (msgType) {
      case 999:
        return "the other one? ¯_(ツ)_/¯";
      default:
        return "text";
    }
  }

  private templateOutputContexts(): string {
    for (let response of this.intent.responses) {
      for (let ctx of response.affectedContexts) {
        if (ctx.name !== undefined) {
          this.addImport(varName(ctx.name, this.cxPre), "../contexts");
          this._outputContexts.add(ctx);
        }
      }
    }
    return [...this._outputContexts]
      .filter(x => x.name !== undefined)
      .map(x => `${varName(x.name!, this.cxPre)},`)
      .join("\n");
  }

  private templateInputContexts(): string {
    for (let ctx of this.intent.contexts) {
      this.addImport(varName(ctx, this.cxPre), "../contexts");
      this._inputContexts.add(ctx);
    }
    return [...this._inputContexts]
      .map(name => `${varName(name, this.cxPre)}.name!,`)
      .join("\n");
  }

  private includeEntityImports(): void {
    for (let phrase of this.intent.trainingPhrases) {
      for (let part of phrase.data) {
        if (IntentTemplate.typeOfPart(part) === PartType.UserGenerated) {
          const varName = getVar(`${ENTITY_PREFIX}_${part.meta.substr(1)}`);
          if (varName !== null) {
            this.addImport(varName, `../${ENTITY_TYPE_DIR}`);
          }
        }
      }
    }
  }
}

function isStringArray(obj: any): obj is string[] {
  if ((obj as string[]).length !== undefined) {
    return true;
  }
  return false;
}
