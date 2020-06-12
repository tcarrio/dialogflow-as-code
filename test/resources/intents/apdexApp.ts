export const apdexAppIntent =  {
  id: "9baecab9-71b2-41a4-8b9e-dde63d9cd0a1",
  name: "davisApdexApp",
  auto: true,
  contexts: [],
  responses: [
    {
      resetContexts: false,
      affectedContexts: [],
      parameters: [
        {
          id: "4e6afd1a-8bda-4ca5-93d2-7735d9b5c565",
          required: false,
          dataType: "@apdex",
          name: "apdex",
          value: "$apdex",
          isList: false
        },
        {
          id: "35e9a72f-a171-4dbd-bd32-6d72bc935ab6",
          required: false,
          dataType: "@application",
          name: "application",
          value: "$application",
          isList: false
        },
        {
          id: "fff1b6cf-9896-4148-8579-bb7ed03b19b6",
          required: false,
          dataType: "@sys.date-time",
          name: "date-time",
          value: "$date-time",
          isList: false
        }
      ],
      messages: [
        {
          type: 0,
          lang: "en",
          speech: []
        }
      ],
      defaultResponsePlatforms: {},
      speech: []
    }
  ],
  priority: 750000,
  webhookUsed: true,
  webhookForSlotFilling: false,
  lastUpdate: 1545255182,
  fallbackIntent: false,
  events: [],
  trainingPhrases: [
    {
      id: "3b2baf4b-78ef-43d4-af71-6763ef71efeb",
      data: [
        {
          text: "describe the ",
          userDefined: false
        },
        {
          text: "user experience",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        },
        {
          text: " over ",
          userDefined: false
        },
        {
          text: "the weekend",
          alias: "date-time",
          meta: "@sys.date-time",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    },
    {
      id: "77b1e97a-a909-471f-ba9e-bcad6859d3dc",
      data: [
        {
          text: "how was the ",
          userDefined: false
        },
        {
          text: "user experience",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    },
    {
      id: "42e3092b-0451-4097-936f-71605ab76f02",
      data: [
        {
          text: "apdex",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        },
        {
          text: " ",
          userDefined: false
        },
        {
          text: "this week",
          alias: "date-time",
          meta: "@sys.date-time",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    },
    {
      id: "245b15bc-bd0f-433d-86ba-bcb4fca20c06",
      data: [
        {
          text: "apdex",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    },
    {
      id: "e94072fa-ed54-4534-b112-c8382a6b5ec1",
      data: [
        {
          text: "what was the ",
          userDefined: false
        },
        {
          text: "apdex",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        },
        {
          text: " ",
          userDefined: false
        },
        {
          text: "in the last 6 hours",
          alias: "date-time",
          meta: "@sys.date-time",
          userDefined: true
        },
        {
          text: "?",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    },
    {
      id: "252eef34-4244-4123-9db6-80466c1720a8",
      data: [
        {
          text: "what was the ",
          userDefined: false
        },
        {
          text: "apdex",
          alias: "apdex",
          meta: "@apdex",
          userDefined: false
        },
        {
          text: " on ",
          userDefined: false
        },
        {
          text: "easy travel",
          alias: "application",
          meta: "@application",
          userDefined: false
        }
      ],
      isTemplate: false,
      count: 0,
      updated: 1545254234
    }
  ]
}