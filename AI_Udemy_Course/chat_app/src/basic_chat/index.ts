import OpenAI from "openai";

const openai = new OpenAI();

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

    context.push({
        role: "assistant",
        content: responseMessage.content,
    })

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