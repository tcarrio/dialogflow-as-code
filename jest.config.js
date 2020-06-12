module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/test"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  moduleNameMapper: {
    "@davis-types/commmon": "<rootDir>/../../types/common/src",
    "@davis/dialogflow-as-code": "<rootDir>/../dialogflow-as-code/src",
    "@davis/utils": "<rootDir>/../utils/src",
  },
  verbose: true,
  testTimeout: 60000,
  name: require("./package.json").name,
  displayName: require("./package.json").name,
};
