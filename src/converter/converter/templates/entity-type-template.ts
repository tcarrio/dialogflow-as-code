import { EntityTypeImport } from "../../common";
import { Entity } from "dialogflow";
import { ImportTemplate } from "./import-template";
import { TemplateProcessor } from "../template-processor";
import { ENTITY_PREFIX } from "../../common/globals";

export class EntityTypeTemplate extends ImportTemplate
  implements TemplateProcessor {
  public constructor(private entityType: EntityTypeImport) {
    super(`${ENTITY_PREFIX}_${entityType.name}`);
  }

  public processTemplate(): string {
    this.addImport("entityType");
    const processedEntityType = `import { EntityType } from 'dialogflow';

const ${this.templateVariableName()}: EntityType =
  entityType()
  .displayName("${this.templateName()}")
  ${this.templateEntities()}
  .kind(${this.templateKind()})
  .autoExpand(${this.templateExpand()})
  .build()

export { ${this.templateVariableName()} };
`;

    const content = [this.templateImports(), processedEntityType].join("");

    return content;
  }

  private templateName(): string {
    return this.entityType.name;
  }

  private templateEntities(): string {
    this.addImport("syn");
    return `.e([
${this.entityType.entities.map(this.templatePhrase).join(",\n")}
  ])`;
  }

  private templatePhrase(entity: Entity): string {
    return entity.synonyms.map(s => `    syn("${s}")`).join(",\n");
  }

  private templateKind() {
    this.addImport("ek");
    return this.entityType.isEnum ? "ek.list" : "ek.map";
  }

  private templateExpand() {
    this.addImport("em");
    return this.entityType.automatedExpansion ? "em.default" : "em.unspecified";
  }
}
