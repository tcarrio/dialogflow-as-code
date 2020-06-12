import { TestIntent, TestResults } from "./data-interfaces";
import { Logger } from "../common/logger";

export interface Options {
  tests: TestFile[];
  reporters: Reporter[];
  config: DFConfig;
  speed: boolean;
  logger: Logger
}
export interface TestFile {
  failure?: {
    strict?: number;
    lax?: number;
  };
  intents: TestIntent[];
}
export interface TestConfig{
failure?: {
  strict?: number;
  lax?: number;
};}
export interface DFConfig {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
export interface Reporter {
  formatData(reports: TestResults[]): void;
  buildChart?(): void;
  activateReport(logger: Logger): void;
}