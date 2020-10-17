export type Diff<T> = [Partial<T>, Partial<T>];
export type NestedDiff<T> = { [P in keyof T]?: [T[P], T[P]] };
export interface Field {
  value: string;
  subfields?: Field[];
}
