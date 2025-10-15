import { hostedMcpTool, Agent, AgentInputItem, Runner } from "@openai/agents";
import { z } from "zod";

// Tool definitions
const mcp = hostedMcpTool({
  serverLabel: "fern_mcp_server",
  serverUrl: "https://fern-mcp-server.vercel.app/api/mcp",
  allowedTools: ["ask_fern_ai"],
  requireApproval: "never",
});
const ClassifyIntentSchema = z.object({
  edit_docs_site: z.boolean(),
  explore_analytics: z.boolean(),
  ask_fern: z.boolean(),
  general: z.boolean(),
});
const classifyIntent = new Agent({
  name: "Classify intent",
  instructions: `Categorize whether the user's intent is to:
edit_docs_site: edit a Fern Docs site using Fern Editor
explore_analytics: explore site metrics/analytics
ask_fern: ask a question about Fern
general: everything else

[What is Fern?]
Instant Docs and SDKs for your API
Start with an API spec. Generate SDKs in multiple languages and interactive API documentation tailored to your brand.`,
  model: "gpt-5-nano",
  outputType: ClassifyIntentSchema,
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto",
    },
    store: true,
  },
});

const respondToGeneralQuery = new Agent({
  name: "Respond to general query",
  instructions: "Respond in ye old english.",
  model: "gpt-5",
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto",
    },
    store: true,
  },
});

const respondToAskFernQuery = new Agent({
  name: "Respond to Ask Fern query",
  instructions: "",
  model: "gpt-5",
  tools: [mcp],
  modelSettings: {
    reasoning: {
      effort: "low",
      summary: "auto",
    },
    store: true,
  },
});

const respondToExploreAnalyticsQuery = new Agent({
  name: "Respond to explore analytics query",
  instructions: `Answer the user's questions based using the data below:

[data]
{
  \"domain\": \"buildwithfern.com/learn\",
  \"timeRange\": \"Last 7 days\",
  \"summary\": {
    \"visitors\": 2623,
    \"pageViews\": 13417
  },
  \"timeseries\": {
    \"groupBy\": \"day\",
    \"days\": [
      \"Oct 8\",
      \"Oct 9\",
      \"Oct 10\",
      \"Oct 11\",
      \"Oct 12\",
      \"Oct 13\",
      \"Oct 14\",
      \"Oct 15\"
    ]
  },
  \"paths\": [
    { \"path\": \"/\", \"visitors\": 1835, \"views\": 2616 },
    { \"path\": \"/learn/home\", \"visitors\": 576, \"views\": 1948 },
    { \"path\": \"/pricing\", \"visitors\": 487, \"views\": 584 },
    { \"path\": \"/learn/docs/getting-started/overview\", \"visitors\": 192, \"views\": 473 },
    { \"path\": \"/careers\", \"visitors\": 174, \"views\": 261 },
    { \"path\": \"/learn/docs/getting-started/quickstart\", \"visitors\": 141, \"views\": 399 },
    { \"path\": \"/learn/sdks/overview/introduction\", \"visitors\": 139, \"views\": 367 },
    { \"path\": \"/showcase\", \"visitors\": 99, \"views\": 138 },
    { \"path\": \"/post/series-a\", \"visitors\": 90, \"views\": 96 },
    { \"path\": \"/book-demo\", \"visitors\": 72, \"views\": 122 }
  ],
  \"countries\": [
    { \"country\": \"United States\", \"visitors\": 1108, \"views\": 6592 },
    { \"country\": \"India\", \"visitors\": 245, \"views\": 854 },
    { \"country\": \"United Kingdom\", \"visitors\": 130, \"views\": 633 },
    { \"country\": \"Germany\", \"visitors\": 123, \"views\": 434 },
    { \"country\": \"France\", \"visitors\": 99, \"views\": 430 },
    { \"country\": \"Canada\", \"visitors\": 88, \"views\": 245 },
    { \"country\": \"China\", \"visitors\": 59, \"views\": 102 },
    { \"country\": \"Singapore\", \"visitors\": 57, \"views\": 183 },
    { \"country\": \"Netherlands\", \"visitors\": 56, \"views\": 697 },
    { \"country\": \"Brazil\", \"visitors\": 45, \"views\": 166 }
  ],
  \"channels\": [
    { \"channel\": \"Referral\", \"visitors\": 1098, \"views\": 4396 },
    { \"channel\": \"Direct\", \"visitors\": 940, \"views\": 5404 },
    { \"channel\": \"Organic Search\", \"visitors\": 771, \"views\": 3387 },
    { \"channel\": \"Unknown\", \"visitors\": 70, \"views\": 169 },
    { \"channel\": \"Organic Social\", \"visitors\": 25, \"views\": 40 },
    { \"channel\": \"Email\", \"visitors\": 8, \"views\": 18 },
    { \"channel\": \"Organic Video\", \"visitors\": 1, \"views\": 1 }
  ],
  \"deviceTypes\": [
    { \"device\": \"Desktop\", \"visitors\": 2206, \"views\": 12354 },
    { \"device\": \"Mobile\", \"visitors\": 412, \"views\": 1047 },
    { \"device\": \"Tablet\", \"visitors\": 7, \"views\": 14 }
  ],
  \"referringDomains\": [
    { \"domain\": \"google.com\", \"visitors\": 741, \"views\": 3279 },
    { \"domain\": \"buildwithfern.com\", \"visitors\": 359, \"views\": 2465 },
    { \"domain\": \"openrouter.ai\", \"visitors\": 105, \"views\": 249 },
    { \"domain\": \"elevenlabs.io\", \"visitors\": 97, \"views\": 179 },
    { \"domain\": \"openapi.tools\", \"visitors\": 59, \"views\": 153 },
    { \"domain\": \"github.com\", \"visitors\": 49, \"views\": 171 },
    { \"domain\": \"vapi.ai\", \"visitors\": 37, \"views\": 81 },
    { \"domain\": \"fanvue.com\", \"visitors\": 26, \"views\": 69 },
    { \"domain\": \"linkedin.com\", \"visitors\": 22, \"views\": 35 },
    { \"domain\": \"webflow.com\", \"visitors\": 22, \"views\": 63 }
  ],
  \"md_llms_txt_visits\": {
    \"agentVisitors\": [
      \"/learn/ask-fern/getting-star...\",
      \"/learn/ask-fern/configuratio...\",
      \"/learn/ask-fern/getting-star...\",
      \"/learn/api-definitions/async...\",
      \"/learn/docs/user-feedback.md\",
      \"/learn/ask-fern/features/cit...\",
      \"/learn/sdks/reference/genera...\",
      \"/learn/ask-fern/configuratio...\",
      \"/learn/docs/developer-tools/...\",
      \"/learn/api-definitions/openr...\"
    ],
    \"humanVisitors\": []
  },
  \"errors\": {
    \"404Pages\": [
      { \"path\": \"/learn/docs/content/1\", \"count\": 1 }
    ]
  },
  \"apiExplorerRequests\": [
    { \"method\": \"POST\", \"path\": \"/discord/install\", \"count\": 5 },
    { \"method\": \"GET\", \"path\": \"/document/:domain\", \"count\": 5 },
    { \"method\": \"GET\", \"path\": \"/slack/get-install\", \"count\": 4 },
    { \"method\": \"POST\", \"path\": \"/chat/:domain\", \"count\": 2 },
    { \"method\": \"POST\", \"path\": \"/guidance/:domain/create\", \"count\": 2 },
    { \"method\": \"POST\", \"path\": \"/document/:domain/create\", \"count\": 2 },
    { \"method\": \"GET\", \"path\": \"/guidance/:domain\", \"count\": 1 },
    { \"method\": \"GET\", \"path\": \"/document/:domain/:document_id\", \"count\": 1 },
    { \"method\": \"DELETE\", \"path\": \"/document/:domain/batch-delete\", \"count\": 1 }
  ],
  \"navigation\": {
    \"topLinks\": [
      { \"title\": \"Docs\", \"urlAlias\": \"url://1\" },
      { \"title\": \"Changelog\", \"urlAlias\": \"url://2\" }
    ],
    \"footer\": {
      \"home\": { \"title\": \"Home\", \"urlAlias\": \"url://6\" },
      \"docs\": { \"title\": \"Docs\", \"urlAlias\": \"url://1\" },
      \"careers\": { \"title\": \"Careers\", \"urlAlias\": \"url://7\" },
      \"contact\": { \"title\": \"Contact\", \"urlAlias\": \"url://8\" },
      \"legal\": [],
      \"docsSubdomains\": [
        { \"title\": \"fern-handbook.docs.buildwithfern.com\", \"urlAlias\": \"url://9\" },
        { \"title\": \"fern-internal.docs.buildwithfern.com\", \"urlAlias\": \"url://10\" },
        { \"title\": \"openapi-union-naming.docs.buildwithfern.com\", \"urlAlias\": \"url://11\" },
        { \"title\": \"venus.docs.buildwithfern.com\", \"urlAlias\": \"url://12\" }
      ],
      \"settings\": [
        { \"title\": \"Members\", \"urlAlias\": \"url://13\" }
      ]
    }
  },
  \"meta\": {
    \"generatedAt\": \"Wednesday, October 15, 2025 at 1:51 PM America/New_York\",
    \"notes\": [
      \"Timeseries chart labels present but per-day counts not explicitly listed.\",
      \"md + llms.txt section lists paths with implied visit counts (30–33 etc.), but exact mapping of counts to specific truncated paths is ambiguous on the page.\"
    ]
  }
}
`,
  model: "gpt-5-nano",
  modelSettings: {
    reasoning: {
      effort: "minimal",
      summary: "auto",
    },
    store: true,
  },
});

const respondToEditDocsSiteQuery = new Agent({
  name: "Respond to edit docs site query",
  instructions: `The user has one site:
buildwithfern.com/learn

Share this link to edit the site in Fern Editor:
https://dashboard.buildwithfern.com/fern/editor/buildwithfern.com%2Flearn/2025-10-15-stephen_chen-48b917-7ec837e9/learn/docs/getting-started/overview`,
  model: "gpt-5",
  modelSettings: {
    reasoning: {
      effort: "low",
      summary: "auto",
    },
    store: true,
  },
});

type WorkflowInput = { input_as_text: string };

// Main code entrypoint
export const runWorkflow = async (workflow: WorkflowInput) => {
  const state = {};
  const conversationHistory: AgentInputItem[] = [
    {
      role: "user",
      content: [
        {
          type: "input_text",
          text: workflow.input_as_text,
        },
      ],
    },
  ];
  const runner = new Runner({
    traceMetadata: {
      __trace_source__: "agent-builder",
      workflow_id: "wf_68efcf9c78fc8190b4f1ff2c2643d3650fd78788a8b6f672",
    },
  });
  const classifyIntentResultTemp = await runner.run(classifyIntent, [
    ...conversationHistory,
  ]);
  conversationHistory.push(
    ...classifyIntentResultTemp.newItems.map((item) => item.rawItem)
  );

  if (!classifyIntentResultTemp.finalOutput) {
    throw new Error("Agent result is undefined");
  }

  const classifyIntentResult = {
    output_text: JSON.stringify(classifyIntentResultTemp.finalOutput),
    output_parsed: classifyIntentResultTemp.finalOutput,
  };
  if (classifyIntentResult.output_parsed.edit_docs_site) {
    const respondToEditDocsSiteQueryResultTemp = await runner.run(
      respondToEditDocsSiteQuery,
      [...conversationHistory]
    );
    conversationHistory.push(
      ...respondToEditDocsSiteQueryResultTemp.newItems.map(
        (item) => item.rawItem
      )
    );

    if (!respondToEditDocsSiteQueryResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    const respondToEditDocsSiteQueryResult = {
      output_text: respondToEditDocsSiteQueryResultTemp.finalOutput ?? "",
    };
    return respondToEditDocsSiteQueryResult;
  } else if (classifyIntentResult.output_parsed.explore_analytics) {
    const respondToExploreAnalyticsQueryResultTemp = await runner.run(
      respondToExploreAnalyticsQuery,
      [...conversationHistory]
    );
    conversationHistory.push(
      ...respondToExploreAnalyticsQueryResultTemp.newItems.map(
        (item) => item.rawItem
      )
    );

    if (!respondToExploreAnalyticsQueryResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    const respondToExploreAnalyticsQueryResult = {
      output_text: respondToExploreAnalyticsQueryResultTemp.finalOutput ?? "",
    };
    return respondToExploreAnalyticsQueryResult;
  } else if (classifyIntentResult.output_parsed.ask_fern) {
    const respondToAskFernQueryResultTemp = await runner.run(
      respondToAskFernQuery,
      [...conversationHistory]
    );
    conversationHistory.push(
      ...respondToAskFernQueryResultTemp.newItems.map((item) => item.rawItem)
    );

    if (!respondToAskFernQueryResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    const respondToAskFernQueryResult = {
      output_text: respondToAskFernQueryResultTemp.finalOutput ?? "",
    };
    return respondToAskFernQueryResult;
  } else {
    const respondToGeneralQueryResultTemp = await runner.run(
      respondToGeneralQuery,
      [...conversationHistory]
    );
    conversationHistory.push(
      ...respondToGeneralQueryResultTemp.newItems.map((item) => item.rawItem)
    );

    if (!respondToGeneralQueryResultTemp.finalOutput) {
      throw new Error("Agent result is undefined");
    }

    const respondToGeneralQueryResult = {
      output_text: respondToGeneralQueryResultTemp.finalOutput ?? "",
    };
    return respondToGeneralQueryResult;
  }
};
