import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";

const pc = new Pinecone();
const openai = new OpenAI();

const studentInfo = `Alexandra Thompson, a 19-year-old computer science sophomore with a 3.7 GPA,
is a member of the programming and chess clubs who enjoys pizza, swimming, and hiking
in her free time in hopes of working at a tech company after graduating from the University of Washington.`;

const clubInfo = `The university chess club provides an outlet for students to come together and enjoy playing
the classic strategy game of chess. Members of all skill levels are welcome, from beginners learning
the rules to experienced tournament players. The club typically meets a few times per week to play casual games,
participate in tournaments, analyze famous chess matches, and improve members' skills.`;

const universityInfo = `The University of Washington, founded in 1861 in Seattle, is a public research university
with over 45,000 students across three campuses in Seattle, Tacoma, and Bothell.
As the flagship institution of the six public universities in Washington state,
UW encompasses over 500 buildings and 20 million square feet of space,
including one of the largest library systems in the world.`;

type Info = {
    info: string,
    reference: string,
    relevance: number
}

const dataToEmbed: Info[] = [
    {
        info: studentInfo,
        reference: "student info for student X",
        relevance: 0.9
    },
    {
        info: clubInfo,
        reference: "club info for university chess club",
        relevance: 0.8
    },
    {
        info: universityInfo,
        reference: "university info for University of Washington",
        relevance: 0.7
    }

]

const pinecodeIndex = pc.index<Info>({name: 'first-index'});

async function openAIEmbeddingReturnValue(value: string){
    const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: value
    })

    return response.data[0].embedding;
}

async function storeEmbeddings(){
    await Promise.all(
        dataToEmbed.map(async (item, index) => {
            const embeddingResult = await openAIEmbeddingReturnValue(item.info);
            
            await pinecodeIndex.upsert({
                records: [{
                    id: `info-${index}`,
                    values: embeddingResult,
                    metadata: item
                }]
            });
        })
    );
}

async function queryEmbeddings(question: string){
    const embeddingResult = await openAIEmbeddingReturnValue(question);

    const queryResult = await pinecodeIndex.query({
        vector: embeddingResult,
        topK: 1,
        includeMetadata: true,
        includeValues: true
    })

    return queryResult;
}

async function askOpenAI(question: string, releventInfo: string){
    const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature: 0,
        messages: [
            { role: 'assistant', content: `Use provided information : ${releventInfo} to answer the question: ${question}` },
            { role: 'user', content: question }
        ]
    })
    console.log(response.choices[0].message);
}


async function main(){
    const question = "What do Alexandra Thompson grades look like?";
    const queryResult = await queryEmbeddings(question);
    console.log(queryResult);
    const releventInfo = queryResult.matches?.[0].metadata;

    if(releventInfo){
        await askOpenAI(question, releventInfo.info);
    }
    // await storeEmbeddings();
}

main();
