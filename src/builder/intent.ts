import { Intent, Parameter, Message, Context } from "dialogflow";
import _ from "lodash";

import { MessageBuilder } from ".";
import { ContextBuilder } from "./context";
import { TrainingPhraseBuilder } from "./training-phrases";

export class IntentBuilder {
  private _intent: Intent;
  private _params: Map<string, Parameter>;
  public constructor(name: string) {
    this._intent = {
      displayName: name,
      parameters: [],
      trainingPhrases: [],
      messages: [],
      outputContexts: [],
      inputContextNames: [],
    };
    this._params = new Map<string, Parameter>();
  }
  public build(): Intent {
    this._params.forEach(p => {
      this._intent.parameters!.push(p);
    });
    return this._intent;
  }
  public webhook(state: boolean) {
    this._intent.webhookState = state
      ? "WEBHOOK_STATE_ENABLED"
      : "WEBHOOK_STATE_UNSPECIFIED";
    return this;
  }
  public fallback(state: boolean) {
    this._intent.isFallback = state;
    return this;
  }
  public machineLearning(state: boolean) {
    this._intent.mlEnabled = state;
    return this;
  }
  public priority(priority: Priority | number) {
    this._intent.priority = priority;
    return this;
  }
  public inputContexts(names: string[]) {
    this._intent.inputContextNames = names;
    return this;
  }
  public events(events: string[]) {
    this._intent.events = events;
    return this;
  }
  public trainingPhrases(
    bs: TrainingPhraseBuilder[],
    generateParams: boolean = true,
  ) {
    bs.forEach(b => {
      if (generateParams) {
        b.extractParameters().forEach(p => {
          if (!this._params.has(p.displayName)) {
            this._params.set(p.displayName, p);
          }
        });
      }
      this._intent.trainingPhrases!.push(b.build());
    });
    return this;
  }
  public action(act: string) {
    this._intent.action = act;
    return this;
  }
  public outputContexts(cxs: (Context | ContextBuilder)[]) {
    this._intent.outputContexts!.push(
      ...cxs.map(cx => {
        return cx instanceof ContextBuilder ? cx.build() : cx;
      }),
    );
    return this;
  }
  public resetContexts(state: boolean) {
    this._intent.resetContexts = state;
    return this;
  }
  public parameters(ps: Parameter[]) {
    ps.forEach(p => {
      this._params.set(p.displayName, p);
    });
    return this;
  }
  public messages(ms: (Message | MessageBuilder)[]) {
    this._intent.messages!.push(
      ...ms.map(m => {
        return m instanceof MessageBuilder ? m.build() : m;
      }),
    );
    return this;
  }
  public followUpOf(intent: string | Intent) {
    if (typeof intent === "string") {
      this._intent.parentFollowupIntentName = intent;
    } else {
      this._intent.parentFollowupIntentName = intent.displayName;
    }
    return this;
  }

  // Short-hand
  public wh(state: boolean) {
    return this.webhook(state);
  }
  public fb(state: boolean) {
    return this.fallback(state);
  }
  public ml(state: boolean) {
    return this.machineLearning(state);
  }
  public pr(priority: Priority | number) {
    return this.priority(priority);
  }
  public ic(names: string[]) {
    return this.inputContexts(names);
  }
  public ev(events: string[]) {
    return this.events(events);
  }
  public tps(bs: TrainingPhraseBuilder[], generateParams: boolean = true) {
    return this.trainingPhrases(bs, generateParams);
  }
  public ac(act: string) {
    return this.action(act);
  }
  public oc(cxs: (Context | ContextBuilder)[]) {
    return this.outputContexts(cxs);
  }
  public rc(state: boolean) {
    return this.resetContexts(state);
  }
  public ps(ps: Parameter[]) {
    return this.parameters(ps);
  }
  public ms(ms: (Message | MessageBuilder)[]) {
    return this.messages(ms);
  }
  public fo(intent: string | Intent) {
    return this.followUpOf(intent);
  }
}

export function intent(name: string): IntentBuilder {
  return nt(name);
}

export function nt(name: string): IntentBuilder {
  return new IntentBuilder(name);
}

export enum Priority {
  HIGHEST = 1000000,
  HIGH = 750000,
  NORMAL = 500000,
  LOW = 250000,
  IGNORE = -1,
}
