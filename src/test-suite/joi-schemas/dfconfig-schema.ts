import joi from "joi";
export const DFConfigSchema = joi.object().keys({
  type: joi.string(),
  project_id: joi.string(),
  private_key_id: joi.string(),
  private_key: joi.string(),
  client_email: joi.string(),
  client_id: joi.string(),
  auth_uri: joi.string(),
  token_uri: joi.string(),
  auth_provider_x509_cert_url: joi.string(),
  client_x509_cert_url: joi.string(),
});
