import { entityType, syn, ek } from "../../builder";

export const etFruit = entityType()
  .d("fruit")
  .e([syn("apple"), syn("strawberry")])
  .k(ek.list)
  .build();
