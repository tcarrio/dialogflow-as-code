import {
  EntityType,
  Entity,
  EntityKind,
  EntityAutoExpansionMode,
} from "dialogflow";

import { IBuilder } from "./types";

export const DEFAULT_ENTITY_TYPE = {
  displayName: "",
  entities: [],
  kind: "KIND_LIST" as any,
  autoExpansionMode: "AUTO_EXPANSION_MODE_UNSPECIFIED" as any,
};

export class EntityTypeBuilder implements IBuilder<EntityType> {
  private _entityType: any;
  private _valid: number;
  public constructor() {
    this._entityType = {
      entities: [],
    };
    this._valid = 0 | 1; // expansion mode set by default
  }
  public build(): EntityType {
    if (!this.isEntityType) {
      throw new Error("EntityType built unsuccessfully");
    }
    return this._entityType;
  }
  private isEntityType(): this is EntityType {
    return !(this._valid ^ 15);
  }
  public entities(entities: (SynonymsBuilder | Entity)[]): EntityTypeBuilder {
    this._entityType.entities.push(
      ...entities.map((et) =>
        et instanceof SynonymsBuilder ? et.build() : et,
      ),
    );
    this._valid = this._valid | 8;
    return this;
  }
  public displayName(displayName: string): EntityTypeBuilder {
    this._entityType.displayName = displayName;
    this._valid = this._valid | 4;
    return this;
  }
  public kind(kind: EntityKind): EntityTypeBuilder {
    this._entityType.kind = kind;
    this._valid = this._valid | 2;
    return this;
  }
  public autoExpand(
    autoExpansionMode: EntityAutoExpansionMode,
  ): EntityTypeBuilder {
    this._entityType.autoExpansionMode = autoExpansionMode;
    this._valid = this._valid | 1;
    return this;
  }
  public name(name: string): EntityTypeBuilder {
    this._entityType.name = name;
    return this;
  }

  // Short-hand
  public e(entities: (SynonymsBuilder | Entity)[]): EntityTypeBuilder {
    return this.entities(entities);
  }
  public d(displayName: string): EntityTypeBuilder {
    return this.displayName(displayName);
  }
  public k(kind: EntityKind): EntityTypeBuilder {
    return this.kind(kind);
  }
  public a(autoExpansionMode: EntityAutoExpansionMode): EntityTypeBuilder {
    return this.autoExpand(autoExpansionMode);
  }
  public n(name: string): EntityTypeBuilder {
    return this.name(name);
  }
}

export function entityType(): EntityTypeBuilder {
  return new EntityTypeBuilder();
}

export function et(): EntityTypeBuilder {
  return entityType();
}

export const ek: { [key: string]: EntityKind } = {
  list: "KIND_LIST",
  map: "KIND_MAP",
};

export const em: { [key: string]: EntityAutoExpansionMode } = {
  default: "AUTO_EXPANSION_MODE_DEFAULT",
  unspecified: "AUTO_EXPANSION_MODE_UNSPECIFIED",
};

export class SynonymsBuilder implements IBuilder<Entity> {
  private _synonyms: Entity;
  private _firstAccess: boolean = true;
  public constructor(value: string) {
    this._synonyms = { value, synonyms: [value] };
  }
  public build(): Entity {
    return this._synonyms;
  }
  public s(synonyms: string[] & { 0: string }): SynonymsBuilder {
    if (this._firstAccess) {
      this._synonyms.synonyms = synonyms;
      this._firstAccess = false;
    } else {
      this._synonyms.synonyms.push(...synonyms);
    }
    return this;
  }
}

export function synonym(value: string): SynonymsBuilder {
  return new SynonymsBuilder(value);
}

export function syn(value: string): SynonymsBuilder {
  return synonym(value);
}
