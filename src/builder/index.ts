import { Intent, EntityType, Context } from "dialogflow";

import { IntentBuilder } from "./intent";
import { ContextBuilder } from "./context";
import { EntityTypeBuilder } from "./entity-type";

export interface Dialogflow {
  intents: Intent[];
  entityTypes: EntityType[];
  contexts: Context[];
}

export class DialogflowBuilder {
  private _intents: Intent[] = [];
  private _entityTypes: EntityType[] = [];
  private _contexts: Context[] = [];

  public constructor() {}
  // intents
  public intents(bs: (IntentBuilder | Intent)[]): DialogflowBuilder {
    this._intents.push(
      ...bs.map(b => {
        return b instanceof IntentBuilder ? b.build() : b;
      }),
    );
    return this;
  }
  public its(bs: (IntentBuilder | Intent)[]): DialogflowBuilder {
    return this.intents(bs);
  }
  // entity types
  public entityTypes(
    bs: (EntityTypeBuilder | EntityType)[],
  ): DialogflowBuilder {
    this._entityTypes.push(
      ...bs.map(b => {
        return b instanceof EntityTypeBuilder ? b.build() : b;
      }),
    );
    return this;
  }
  public ets(bs: (EntityTypeBuilder | EntityType)[]): DialogflowBuilder {
    return this.entityTypes(bs);
  }
  // contexts
  public contexts(bs: (ContextBuilder | Context)[]): DialogflowBuilder {
    this._contexts.push(
      ...bs.map(b => {
        return b instanceof ContextBuilder ? b.build() : b;
      }),
    );
    return this;
  }
  public cxs(bs: (ContextBuilder | Context)[]): DialogflowBuilder {
    return this.contexts(bs);
  }
  public build() {
    return {
      intents: this._intents,
      entityTypes: this._entityTypes,
      contexts: this._contexts,
    };
  }
}

export interface BuilderOptions {
  entityTypes?: {
    parameters?: {
      mandatory?: boolean;
    };
  };
  intents?: {};
  contexts?: {};
}

export default DialogflowBuilder;

export interface Indexable {
  [key: string]: any;
}

export interface IBuilder<T> {
  build(): T;
}

export function isBuilder(obj: any): obj is IBuilder<any> {
  return (obj as IBuilder<any>).build !== undefined;
}

export * from "./defaults";
export * from "./entity-type";
export * from "./message";
export * from "./intent";
export * from "./context";
export * from "./training-phrases";
export * from "./parts";
