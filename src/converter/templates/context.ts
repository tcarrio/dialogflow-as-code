import { Context } from "dialogflow";
import _ from "lodash";

interface Options {
  context: Context;
  variableName: string;
  interfaceName: string;
}

export function contextTemplate(opts: Options): string {
  return template({
    ...opts,
    interfaceParams:
      opts.context.parameters !== undefined
        ? JSON.stringify(opts.context, null, 2)
        : false,
    contextParams: false, // TODO: Implement context parameters
  });
}

const content = `import { Context } from 'dialogflow';

interface <%= interfaceName %> extends Context {
  name: "<%= context.name %>";
  <% if (interfaceParams) {
    %>parameters: <%= interfaceParams %><%
  } %>
}

const <%= variableName %>: Context = {
  name: "<%= context.name %>",
  lifespanCount: <%= context.lifespan %>,
  <% if (contextParams) {
    %>parameters: <%= contextParams %><%
  } %>
}

export { <%= variableName %>, <%= interfaceName %> };
`;

const template = _.template(content);
