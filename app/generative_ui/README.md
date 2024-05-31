# LangChain.JS x Generative UI

This directory contains a sample implementation of Generative UI, powered by [LangChain.JS](https://js.langchain.com/v0.2/docs/introduction/) and [AI SDK](https://www.npmjs.com/package/ai).

The sample implements a tool calling agent, which outputs an interactive UI element when streaming intermediate outputs of tool calls to the client.

We introduce two utilties which wraps the AI SDK to make it easier to yield React elements inside runnables and tool calls: [`createRunnableUI`](./utils/server.tsx#L89) and [`streamRunnableUI`](./utils/server.tsx#L26).

- The `streamRunnableUI` executes the provided Runnable with `streamEvents` method and sends every `stream` event to the client via the React Server Components stream.
- The `createRunnableUI` wraps the `createStreamableUI` function from AI SDK to properly hook into the Runnable event stream.

The usage is then as follows:

```tsx ai/chain.tsx
"use server";

const tool = new DynamicStructuredTool({
  // ...
  func: async (input, config) => {
    // create a new streamable UI and wire it up to the streamEvents
    const stream = createRunnableUI(config);
    stream.update(<div>Searching...</div>);

    const result = await images(input);

    // update the UI element with the rendered results
    stream.done(
      <Images
        images={result.images_results
          .map((image) => image.thumbnail)
          .slice(0, input.limit)}
      />,
    );

    return `[Returned ${result.images_results.length} images]`;
  },
});

// add LLM, prompt, etc...

const tools = [tool];

export const agentExecutor = new AgentExecutor({
  agent: createToolCallingAgent({ llm, tools, prompt }),
  tools,
});
```

```tsx agent.tsx
async function agent(inputs: { input: string }) {
  "use server";
  return streamRunnableUI(agentExecutor, inputs);
}

export const EndpointsContext = exposeEndpoints({ agent });
```

In order to ensure all of the client components are included in the bundle, we need to wrap all of the Server Actions into `exposeEndpoints` method. These endpoints will be accessible from the client via the Context API, seen in the `useActions` hook.

```tsx
"use client";
import type { EndpointsContext } from "./agent";

export default function Page() {
  const actions = useActions<typeof EndpointsContext>();
  const [node, setNode] = useState();

  return (
    <div>
      {node}

      <button
        onClick={async () => {
          setNode(await actions.agent({ input: "cats" }));
        }}
      >
        Get images of cats
      </button>
    </div>
  );
}
```
