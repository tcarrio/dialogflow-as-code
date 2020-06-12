export const tsConfig = () => JSON.stringify(tsConfigContent, null, 2);

const tsConfigContent = {
  compilerOptions: {
    outDir: "./dist",
    target: "es2017",
    lib: ["es2015", "es2017"],
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    esModuleInterop: true,
    module: "commonjs",
    moduleResolution: "node",
    strict: true,
    sourceMap: true,
    alwaysStrict: true,
    removeComments: true,
    rootDir: "./src",
    declaration: true,
  },
  include: ["./**/*.ts"],
};
