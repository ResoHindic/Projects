import OpenAI from "openai";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const openai = new OpenAI();
const fileName = "data2.json";

export type EmbeddingsResponse = {
    input: string,
    embedding: number[]
}

export async function generateEmbeddings(input: string | string[]) {
    const response = await openai.embeddings.create({
        input: input,
        model: "text-embedding-3-small"
    });

    console.log(response.data[0].embedding);
    return response;
}


export function loadJSONFileEmbeddings<T>(fileName: string): T {
    const filePath = join(__dirname, fileName);
    const rawDate = readFileSync(filePath);

    return JSON.parse(rawDate.toString());
}

function saveDataToJsonFile(data: any, fileName: string) {
    const dataString = JSON.stringify(data);
    const dataBuffer = Buffer.from(dataString);
    const filePath = join(__dirname, fileName);
    
    writeFileSync(filePath, dataBuffer);
    console.log(`Data saved to ${fileName}`);
}

async function main() {
    const data = loadJSONFileEmbeddings<string[]>(fileName);
    const embeddings = await generateEmbeddings(data);
    const dataWithEmbeddings: EmbeddingsResponse[] = [];
    for(let i = 0; i < data.length; i++) {
        dataWithEmbeddings.push({
            input: data[i],
            embedding: embeddings.data[i].embedding
        });
    }
    
    saveDataToJsonFile(dataWithEmbeddings, "embeddings_data2.json");
    console.log("Embeddings generated and saved to embeddings_data2.json");

}

main();

//generateEmbeddings("Hello world");
