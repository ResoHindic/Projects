import { ChromaClient, getEmbeddingFunction } from "chromadb";
import OpenAI from "openai";


const client = new ChromaClient({
    host: "localhost",
    port: 8000,
    ssl: false
})

const embeddingFunction = getEmbeddingFunction({
    model: "text-embedding-3-small",
    dimensions: 1536,
    openai: new OpenAI()
});

async function main() {
    const response = await client.createCollection({
        name: 'data-test-embeddingsFuction'
    });
    console.log(response);
}

async function addData() {
    const collection = await client.getCollection({
        name: 'data-test'
    });

    const result = await collection.add({
        ids: ['id111'],
        documents: ['This is a test document.'],
        embeddings: [[0.1, 0.2]]
    });

    const addedData = await collection.get({
        ids: ['id111']
    });

    console.log(addedData);
    console.log(result);
}

main();
// addData();