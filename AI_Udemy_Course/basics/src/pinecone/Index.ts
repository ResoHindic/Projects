import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone();
type FirstType = {
    coolness: number;
    refereance: string;
}

// namespace: partition vectors from an index into smaller groups.  
// Make operations limited to onle namespace.
async function createNamespace(){
    const result_index = getIndex();
    const namespace = result_index.namespace('first-namespace');
    // console.log(namespace);
}

function getIndex(){
    const index = pc.index<FirstType>({name: 'first-index'});
    // console.log(index);
    return index;
}

async function listIndexes(){
    const response = await pc.listIndexes();
    const response2 = await pc.describeIndex('first-index');
    console.log(response.indexes![0].spec);
    console.log(response2);
}

function generateNumberArray(length: number){
    return Array.from({length}, () => Math.random());
}

async function queryVectors(){
    const index = getIndex();
    const queryResult = await index.query({
        id: 'id-1',
        topK: 1,
        includeMetadata: true
    })
    console.log(queryResult);
}

async function upsertVectors(){
    const embeddings = generateNumberArray(1536);
    const index = getIndex();
    
    const upsertResult = await index.upsert({
        records: [{
            id: 'id-1',
            values: embeddings,
            metadata: {
                coolness: 100,
                refereance: 'This is an update to metadata string'
            }   
        }]
    })
}

async function createIndex(){
    const response = await pc.createIndex({
        name: 'first-index',
        dimension: 1536,
        metric: 'cosine',
        spec: {
            serverless: {
                cloud: 'aws',
                region: 'us-east-1'
            }
        }
    });
    console.log(response);
}

async function main(){
    await queryVectors();
    // await upsertVectors();
    // getIndex()
    // await listIndexes();
    // await createIndex();
};

main();

/*
    code from Pinecone documentation for creating an index with a model mapping
*/

// const indexName = 'developer-quickstart-js';
// await pc.createIndexForModel({
//   name: indexName,
//   cloud: 'aws',
//   region: 'us-east-1',
//   embed: {
//     model: 'llama-text-embed-v2',
//     fieldMap: { text: 'chunk_text' },
//   },
//   waitUntilReady: true,
// });