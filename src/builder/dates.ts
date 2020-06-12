const past = [
  "yesterday",
  "last weekend",
  "last week",
  "last night",
  "this morning",
  "this weekend",
  "on Sunday",
  "on Monday",
  "on Tuesday",
  "on Wednesday",
  "on Thursday",
  "on Friday",
  "on Saturday",
  "around noon",
  "at midnight",
  "at 3 pm",
  "at 6 pm",
  "at 9 pm",
  "at 12",
  "at noon",
  "at 3 pm",
  "at 6 pm",
];

const future = [
  "tomorrow",
  "next weekend",
  "next week",
  "tomorrow night",
  "tomorrow morning",
  "this weekend",
  "on Sunday",
  "on Monday",
  "on Tuesday",
  "on Wednesday",
  "on Thursday",
  "on Friday",
  "on Saturday",
  "around noon",
  "at midnight",
  "at 3 pm",
  "at 6 pm",
  "at 9 pm",
  "at 12",
  "at noon",
  "at 3 pm",
  "at 6 pm",
];

export class DateTimeResolver {
  public static index: number = 0;
  public static future: string[] = future;
  public static past: string[] = past;
  public static next(historical = true): string {
    const entries = historical ? this.past : this.future;
    return entries[this.index++ % entries.length];
  }
}
