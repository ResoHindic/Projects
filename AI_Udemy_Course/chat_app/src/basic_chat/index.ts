import OpenAI from "openai";
import { encoding_for_model } from "tiktoken";

const openai = new OpenAI();
const encoder = encoding_for_model("gpt-4o");

const MAX_TOKENS = 700;

const context: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [{
    role: "system",
    content: "You are a helpful chatbot that answers questions and provides information.",
}]

async function createChatCompletion() {
    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: context
    });
    const responseMessage = response.choices[0].message;
    context.push(responseMessage);

    if(response.usage && response.usage.total_tokens > MAX_TOKENS) {
        deleteOlderMessages();
    }

    console.log(`${response.choices[0].message.role}: ${response.choices[0].message.content}`);
}

process.stdin.addListener("data", async (input) => {
    const userInput = input.toString().trim();
    context.push({
        role: "user",
        content: userInput,
    })

    await createChatCompletion();
    
});

function deleteOlderMessages() {
    let contextLenght = getContextLength();
    while (contextLenght > MAX_TOKENS && context.length > 1) {
        for (let i = 0; i < context.length; i++){
            const message = context[i];
            if (message.role != 'system') {
                context.splice(i,1);
                contextLenght = getContextLength();
                console.log('New context lenght: ' + contextLenght);
                break;
            }
        }
    }
}

function getContextLength() {
    let length = 0;
    context.forEach((message) => {
        if(typeof message.content === "string") {
            length += encoder.encode(message.content).length;
        } else if (Array.isArray(message.content)) {
            message.content.forEach((messageContent) => {
                if (messageContent && typeof messageContent === 'object' && 'text' in messageContent && typeof (messageContent as any).text === 'string') {
                    length += encoder.encode((messageContent as any).text).length;
                }
            })
        }
    })
    return length;
}
