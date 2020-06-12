module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "jest"],
    extends: [
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "plugin:jest/recommended",
      "plugin:jest/style",
    ],
    parserOptions: {
      ecmaVersion: 6,
      sourceType: "module",
    },
    rules: {
      "comma-dangle": ["error", "always-multiline"],
      "prettier/prettier": "error",
      "@typescript-eslint/indent": ["error", 2],
      "@typescript-eslint/interface-name-prefix": 0,
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/array-type": 0,
      "@typescript-eslint/explicit-function-return-type": 0,
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: false, variables: true },
      ],
      "@typescript-eslint/no-parameter-properties": 0,
      "@typescript-eslint/no-non-null-assertion": 0,
      // disable indent rule in favor of prettier
      "@typescript-eslint/indent": 0,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/camelcase": ["error", { properties: "never" }],
      "@typescript-eslint/no-empty-interface": [
        "error",
        {
          allowSingleExtends: true,
        },
      ],
      // "@typescript-eslint/strict-boolean-expressions": 2,
    },
    env: {
      es6: true,
      node: true,
      "jest/globals": true,
    },
  };
  