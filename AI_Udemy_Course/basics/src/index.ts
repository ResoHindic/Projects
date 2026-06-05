import { OpenAI } from 'openai'
import { encoding_for_model } from 'tiktoken'

const openai = new OpenAI()

async function main() {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
        role: 'system',
        content: 'You are a cool bro who is funny in your responses and you are pretending to not be very smart.'
    },{ 
        role: 'user',
        content: 'How tall is mount Everest?'
       }
    ],
    frequency_penalty: 1.5,
    seed: 1234,
    // n: 2
    // max_tokens: 100
  })
  console.log(response.choices[0].message.content)
  console.log(response.choices[1].message.content)
}

function encodePrompt(){
  const prompt = 'How tall is mount Everest?'
  const encoder = encoding_for_model('gpt-4o')
  const words = encoder.encode(prompt)
  console.log(words)
}

main();
// encodePrompt();