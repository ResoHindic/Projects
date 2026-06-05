import OpenAI from "openai";

const openai = new OpenAI();

function timeOfDay() {
    return '6:00 PM';
}

function getOrderStatus(orderId: string) {
    console.log(`Getting status for order ${orderId}`);
    const orderAsANumber = parseInt(orderId);
    if(orderAsANumber % 2 == 0) {
        return 'IN_PROGRESS';
    }
    return 'COMPLETED';
}

async function callOpenAIWithTools() {
    const context: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { 
            role: "system",
            content: "You are a helpful assistant that gives information about the time of day. And Be creative with your answers."
        },{
            role: "user",
            content: "What is the status of order 1234?"
        }
    ]

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: context,
        tools: [
            {
                type: "function",
                function: {
                    name: "timeOfDay",
                    description: "Get the current time of day"
                }
            },
            {
                type: "function",
                function: {
                    name: "getOrderStatus",
                    description: "Get the status of an order",
                    parameters: {
                        type: "object",
                        properties: {
                            orderId: {
                                type: "string",
                                description: "The ID of the order to get the status for"
                            }
                        },
                        required: ["orderId"]
                    }
                }
            }
        ],
        tool_choice: "auto" // the engine will decide whatich tool to use, if any, to answer the user's question.
    });

    //decide the tool is required to answer the question, if so, call the tool and send the response back to the model.
    const willInvokeFunction = response.choices[0].finish_reason === "tool_calls";
    const toolCall = response.choices[0].message.tool_calls![0] as OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall;

    if(willInvokeFunction) {
        const toolName = toolCall.function.name;

        if(toolName == "timeOfDay") {
            const toolResponse = timeOfDay();

            //send the tool response back to the model to get a final answer for the user.
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: toolResponse,
                tool_call_id: toolCall.id
            });
        }
         if(toolName == "getOrderStatus") {
            const rawArgument = toolCall.function.arguments;
            const parsedArguments = JSON.parse(rawArgument);
            const toolResponse = getOrderStatus(parsedArguments.orderId);

            //send the tool response back to the model to get a final answer for the user.
            context.push(response.choices[0].message);
            context.push({
                role: "tool",
                content: toolResponse,
                tool_call_id: toolCall.id
            });
        }
    }

    const secondResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: context
    });

    console.log(secondResponse.choices[0].message.content);
}

callOpenAIWithTools();