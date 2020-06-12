import joi from "joi";
export const TestFileSchema = joi.object().keys({
  failure: joi
    .object()
    .keys({
      strict: joi.number().optional(),
      lax: joi.number().optional(),
    })
    .optional(),
  intents: [
    joi.array().items(
      joi.object({
        input: joi.string(),
        display: joi.string(),
        text: joi.string().optional(),
        confidence: joi.number().optional(),
        strict: joi.boolean().optional(),
        value: joi.object().optional(),
        followup: joi.object().optional(),
        context: joi.array().optional()
      }),
    ),
  ],
});
