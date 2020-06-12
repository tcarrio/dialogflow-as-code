import { cx } from "../../builder";

export const cxFruit = cx()
  .n("fruit-context")
  .lc(5)
  .p("date-time-original", "string_value")
  .build();
