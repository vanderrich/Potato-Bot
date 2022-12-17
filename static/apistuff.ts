import { MongoClient } from "mongo";
import "dotenv";
const client = new MongoClient();
await client.connect(Deno.env.get("MONGO_URI")!);

export interface Error {
    name: string;
    type: "Slash Command" | "Context Menu" | "Button" | "Select Menu" | "Crash" | "Unknown";
    id: string;
    error: string;
    stack: string;
    code?: number;
    path?: string;
    httpStatus?: number;
}

export interface Vote {
    user: string,
    bot: string,
    source: string
}

export interface APIStuff {
    errors: Error[];
    votes: Vote[];
    online: boolean;
    uptime: number;
    tokens: { userId: string, tokens: Tokens }[];
    // keeping track thing idk
    e: 69;
}

export interface Tokens {
    expires_at: number,
    refresh_token: string,
    access_token: string
}

const api = client.database("api");
const apiStuffs = api.collection<APIStuff>("apistuff");
let apiStuffe = await apiStuffs.findOne({ e: 69 });
if (!apiStuffe) {
    apiStuffs.insertOne({ errors: [], votes: [], online: false, uptime: 0, e: 69, tokens: [] });
    apiStuffe = await apiStuffs.findOne({ e: 69 }) as APIStuff;
}

export const apiStuff = apiStuffe;
export let newVotes: Vote[] = []
export let onlineCooldown = 0;

setInterval(() => {
    onlineCooldown -= 100;
    apiStuff.uptime += 100;
    if (onlineCooldown <= 0) {
        apiStuff.online = false;
        apiStuff.uptime = 0;
        clearInterval(undefined);
    }
}, 100);

setInterval(() => {
    apiStuffs.updateOne({ e: 69 }, { $set: apiStuff });
}, 30000);

export const Ping = async () => {
    apiStuff.online = true;
    onlineCooldown = 30000;
    await apiStuffs.updateOne({ e: 69 }, { $set: apiStuff });
}

export const ClearVotes = () => {
    newVotes = [];
}

export const CreateError = (error: Error) => {
    apiStuff.errors.push(error);
    apiStuffs.updateOne({ e: 69 }, { $set: apiStuff });
}

export const StoreDiscordTokens = (userId: string, tokens: Tokens) => {
    if (apiStuff.tokens == {}) apiStuff.tokens = []
    apiStuff.tokens.push({ userId, tokens });
    apiStuffs.updateOne({ e: 69 }, { $set: apiStuff });
}

export const GetDiscordTokens = (userId: string): Tokens | undefined => {
    return apiStuff.tokens.find((tokens) => tokens.userId == userId)?.tokens;
}

export const DeleteDiscordTokens = (userId: string) => {
    apiStuff.tokens.filter((tokens) => tokens.userId != userId)
}