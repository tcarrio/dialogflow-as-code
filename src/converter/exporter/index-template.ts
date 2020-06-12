export const indexTemplate = (names: string[]) => {
  return names.map(name => `export * from "./${name}";`).join("\n");
};

export const memberTemplate = (names: string[]) => {
  return names.map(name => `export { ${name} } from "./${name}";`).join("\n");
};
