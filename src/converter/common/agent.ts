// TODO: Allow agent to be generated with dialogflow-as-code?
export interface Agent {
  description: string;
  language: string;
  activeAssistantAgents: any[];
  disableInteractionLogs: boolean;
  disableStackdriverLogs: boolean;
  googleAssistant: GoogleAssistant;
  defaultTimezone: string;
  webhook: Webhook;
  isPrivate: boolean;
  customClassifierMode: string;
  mlMinConfidence: number;
  supportedLanguages: any[];
  onePlatformApiVersion: string;
  analyzeQueryTextSentiment: boolean;
  enabledKnowledgeBaseNames: any[];
  knowledgeServiceConfidenceAdjustment: number;
  dialogBuilderMode: boolean;
}

interface GoogleAssistant {
  googleAssistantCompatible: boolean;
  welcomeIntentSignInRequired: boolean;
  startIntents: Intent[];
  systemIntents: any[];
  endIntentIds: string[];
  oAuthLinking: OAuthLinking;
  voiceType: string;
  capabilities: any[];
  protocolVersion: string;
  autoPreviewEnabled: boolean;
  isDeviceAgent: boolean;
}

interface Intent {
  intentId: string;
  signInRequired: boolean;
}

interface OAuthLinking {
  required: boolean;
  grantType: string;
}

interface Webhook {
  url: string;
  username: string;
  headers: Headers;
  available: boolean;
  useForDomains: boolean;
  cloudFunctionsEnabled: boolean;
  cloudFunctionsInitialized: boolean;
}

interface Headers {
  [key: string]: string;
}
