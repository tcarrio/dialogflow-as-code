import { IBuilder, Indexable } from "./types";
import {
  Message,
  Platform,
  TextMessage,
  ImageMessage,
  QuickRepliesMessage,
  CardMessage,
  PayloadMessage,
  SimpleResponsesMessage,
  BasicCardMessage,
  SuggestionsMessage,
  LinkOutSuggestionMessage,
  ListSelectMessage,
  CarouselSelectMessage,
  MessageBase,
  Text,
  Image,
  QuickReplies,
  Card,
  SimpleResponses,
  BasicCard,
  Suggestions,
  LinkOutSuggestion,
  ListSelect,
  CarouselSelect,
} from "dialogflow";

type MessageTypes =
  | "text"
  | "image"
  | "quickReplies"
  | "card"
  | "payload"
  | "simpleResponses"
  | "basicCard"
  | "suggestions"
  | "linkOutSuggestion"
  | "listSelect"
  | "carouselSelect";

export class MessageBuilder implements IBuilder<Message> {
  private _type: MessageTypes = "text";
  private _msg: any = { text: [""] };
  private platform: Platform;

  // Dynamically generate the messages with their types ¯\_(ツ)_/¯
  private _map = {
    text: ($: Indexable): TextMessage => $.get(),
    image: ($: Indexable): ImageMessage => $.get(),
    quickReplies: ($: Indexable): QuickRepliesMessage => $.get(),
    card: ($: Indexable): CardMessage => $.get(),
    payload: ($: Indexable): PayloadMessage => $.get(),
    simpleResponses: ($: Indexable): SimpleResponsesMessage => $.get(),
    basicCard: ($: Indexable): BasicCardMessage => $.get(),
    suggestions: ($: Indexable): SuggestionsMessage => $.get(),
    linkOutSuggestion: ($: Indexable): LinkOutSuggestionMessage => $.get(),
    listSelect: ($: Indexable): ListSelectMessage => $.get(),
    carouselSelect: ($: Indexable): CarouselSelectMessage => $.get(),
  };

  public constructor(
    mType: MessageTypes = "text",
    platform: Platform = "PLATFORM_UNSPECIFIED",
  ) {
    this._type = mType;
    this.platform = platform;
  }
  // returns only the most recently set message type
  public build(): Message {
    return this._map[this._type](this);
  }
  public get(): MessageBase {
    if (!this._msg) {
      throw new Error(
        `The '${this._type}' message type was not built successfully`,
      );
    }
    const msg = {
      message: this._type,
      platform: this.platform,
      [this._type]: this._msg,
    };
    return msg;
  }

  public pf(platform: Platform): MessageBuilder {
    this.platform = platform;
    return this;
  }

  // Default setter assumes TextMessage with string[] passed
  public set(payload: string[]): MessageBuilder {
    this._type = "text";
    this._msg = { text: payload };
    return this;
  }

  public text(payload: Text): MessageBuilder {
    this._type = "text";
    this._msg = payload;
    return this;
  }

  public image(payload: Image): MessageBuilder {
    this._type = "image";
    this._msg = payload;
    return this;
  }

  public quickReply(payload: QuickReplies): MessageBuilder {
    this._type = "quickReplies";
    this._msg = payload;
    return this;
  }

  public card(payload: Card): MessageBuilder {
    this._type = "card";
    this._msg = payload;
    return this;
  }

  public simpleResponses(payload: SimpleResponses): MessageBuilder {
    this._type = "payload";
    this._msg = payload;
    return this;
  }

  public basic(payload: BasicCard): MessageBuilder {
    this._type = "basicCard";
    this._msg = payload;
    return this;
  }

  public suggestion(payload: Suggestions): MessageBuilder {
    this._type = "suggestions";
    this._msg = payload;
    return this;
  }

  public linkOutSuggestion(payload: LinkOutSuggestion): MessageBuilder {
    this._type = "linkOutSuggestion";
    this._msg = payload;
    return this;
  }

  public listSelect(payload: ListSelect): MessageBuilder {
    this._type = "listSelect";
    this._msg = payload;
    return this;
  }

  public carousel(payload: CarouselSelect): MessageBuilder {
    this._type = "carouselSelect";
    this._msg = payload;
    return this;
  }
}

export function msg(mType: MessageTypes = "text") {
  return new MessageBuilder(mType);
}
