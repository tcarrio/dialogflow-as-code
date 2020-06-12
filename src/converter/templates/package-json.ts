export const packageJson = () => JSON.stringify(packageJsonContents, null, 2);

const packageJsonContents = {
  name: "dialogflow-resources",
  version: "1.0.0",
  main: "dist/index.js",
  scripts: {
    start: "node dist/index.js",
    build: "tsc",
  },
  author: "",
  license: "",
  engines: {
    node: "12.14.0",
  },
  devDependencies: {
    "@types/dialogflow": "^0.9.3",
    "@typescript-eslint/eslint-plugin": "^1.7.0",
    "@typescript-eslint/parser": "^1.7.0",
    eslint: "^5.16.0",
    "eslint-config-prettier": "^4.2.0",
    "eslint-plugin-prettier": "^3.0.1",
    nodemon: "^1.19.0",
    prettier: "^1.16.4",
    "ts-node": "^8.0.3",
    typescript: "^3.4.5",
  },
  dependencies: {
    "@0xc/dialogflow-as-code": "^2.0.0",
    "@types/debug": "^4.1.4",
    "@types/node": "^12.12.0",
    dialogflow: "^0.8.2",
    googleapis: "^39.2.0",
    "reflect-metadata": "^0.1.13",
    typedi: "^0.8.0",
  },
};
