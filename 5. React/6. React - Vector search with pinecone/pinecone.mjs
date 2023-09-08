
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const pinecone = new Pinecone({
    environment: process.env.PINECONE_ENVIRONMENT,
    apiKey: process.env.PINECONE_API_KEY,
});

export default pinecone


export const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

