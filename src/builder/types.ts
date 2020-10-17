export interface BuilderOptions {
  entityTypes?: {
    parameters?: {
      mandatory?: boolean;
    };
  };
  intents?: {};
  contexts?: {};
}

export interface Indexable {
  [key: string]: any;
}

export interface IBuilder<T> {
  build(): T;
}

export function isBuilder(obj: any): obj is IBuilder<any> {
  return (obj as IBuilder<any>).build !== undefined;
}
