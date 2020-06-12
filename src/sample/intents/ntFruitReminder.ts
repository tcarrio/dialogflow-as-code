import { intent, tp, det } from "../../builder";
import { etFruit } from "../entities";
import { cxFruit } from "../contexts/cxFruit";

const tomorrow = det("date-time");

export const ntFruitReminder = intent("fruit-reminder")
  .priority(500000)
  .webhook(true)
  .trainingPhrases([
    tp(["could I have a", etFruit, tomorrow, "?"]),
    tp(["remind me to eat", etFruit, tomorrow]),
  ])
  .inputContexts([cxFruit.name])
  .build();
