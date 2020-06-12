import { intent, Priority, tp, msg, det } from "../../builder";
import { etFruit as fruit, etSample as sample } from "../entities";
import { cxFruit } from "../contexts/cxFruit";
import { Event } from "../events";
import { ntFruitReminder } from "./ntFruitReminder";

const lastWeek = det("date-time");

export const ntFruitInfo = intent("fruitInfo")
  .priority(Priority.LOW)
  .webhook(true)
  .trainingPhrases([
    tp(["describe the", sample, "of", fruit, "over", lastWeek]),
    tp(["how was the", sample, "of", fruit]),
    tp([sample, "of", fruit, lastWeek]),
    tp([sample, "of", fruit]),
    tp(["how was the", fruit, sample]),
    tp(["what was the", sample, fruit, lastWeek, "?"]),
    tp(["what was the", sample, "of", fruit]),
  ])
  .messages([
    msg("text")
      .set(["I'm sorry Dave, I can't do that"])
      .build(),
    msg("text")
      .set(["Second response"])
      .build(),
  ])
  .events([Event.FEEDBACK])
  .outputContexts([cxFruit])
  .followUpOf(ntFruitReminder);
