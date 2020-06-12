import _ from "lodash";
import { ImportTemplate } from "./import-template";
import { TemplateProcessor } from "../template-processor";

export class EventTemplate extends ImportTemplate implements TemplateProcessor {
  public constructor() {
    super("");
  }

  public processTemplate(): string {
    return `export enum Event {
  ${this.templateEvents()}
}
`;
  }

  private templateEvents(): string {
    const eventMap: StringMap = getEvents();
    const eventEnums: string[] = [];
    for (let key in eventMap) {
      eventEnums.push(`${eventMap[key]} = "${key}",`);
    }
    return eventEnums.join("\n  ");
  }
}

interface StringMap {
  [key: string]: string;
}
const _events: StringMap = {};

export function processEvent(event: string): string {
  const name = nameEvent(event);
  _events[event] = name;
  return name;
}

function nameEvent(name: string) {
  return _.upperFirst(_.camelCase(name));
}

export function getEvents(): StringMap {
  return _events;
}
