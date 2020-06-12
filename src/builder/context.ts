import { Context, Value } from "dialogflow";
import { IBuilder } from ".";

export class ContextBuilder implements IBuilder<Context> {
  private _context: { [key: string]: any };
  private _valid: number;
  constructor() {
    this._context = { parameters: {} };
    this._valid = 0 | 1 | 2;
  }
  build(): Context {
    if (!this.isContext(this._context)) {
      throw new Error("Context built unsuccessfully");
    }
    return this._context;
  }
  name(name: string): ContextBuilder {
    this._context.name = name;
    this._valid = this._valid | 4;
    return this;
  }
  lifespan(count: number): ContextBuilder {
    this._context.lifespanCount = count;
    this._valid = this._valid | 2;
    return this;
  }
  parameter(field: string, param: Value): ContextBuilder {
    this._context.parameters![field] = param;
    this._valid = this._valid | 1;
    return this;
  }

  // Short-hand
  n(name: string): ContextBuilder {
    return this.name(name);
  }
  lc(count: number): ContextBuilder {
    return this.lifespan(count);
  }
  p(field: string, param: Value): ContextBuilder {
    return this.parameter(field, param);
  }

  private isContext(obj: any): obj is Context {
    return !(this._valid ^ 7);
  }
}

export function context(): ContextBuilder {
  return new ContextBuilder();
}

export function cx(): ContextBuilder {
  return context();
}
