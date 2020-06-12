import * as joi from "joi";
export const ReporterSchema = joi.object().keys({//REVIEW currently unused, as it does not allow extra private values on the reporter.
  formatData: joi.func(),
  buildChart: joi.func().optional(),
  activateReport: joi.func(),
}).unknown(true)
