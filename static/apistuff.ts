import "dotenv";
import { MongoClient } from "mongo";
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
    // keeping track thing idk
    e: 69;
}

export interface AuthData {
    userId: string,
    tokens: Tokens
}

export interface Tokens {
    expires_at: number,
    refresh_token: string,
    access_token: string
}


export interface GuildSettings {
    guildId: string,
    welcomeMessage?: string,
    welcomeChannel?: string,
    welcomeRole?: string,
    tags: { name: string, value: string }[],
    tagDescriptions: { [value: string]: string },
    suggestionChannel?: string,
    ghostPing: boolean,
    statChannels: {
        type: string & "members" | "all members" | "bots" | "boosts" | "role members",
        channel: string,
        role?: string
    }[],
}


const api = client.database("api");
const apiStuffs = api.collection<APIStuff>("apistuff");
const data = client.database("data");
export const guildSettings = data.collection<GuildSettings>("guildsettings");
let apiStuffe = await apiStuffs.findOne({ e: 69 });
if (!apiStuffe) {
    apiStuffs.insertOne({ errors: [], votes: [], online: false, uptime: 0, e: 69 });
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

export const ParseAuthData = (unparsedAuthData: string): AuthData => {
    return JSON.parse(unparsedAuthData.replace(/%22/g, '"').replace(/%2C/g, ",").replace(/\+/g, " "))
}

export const PercentageParseAuthData = (authData: AuthData): string => {
    return JSON.stringify(authData).replace(/"/g, '%22').replace(/,/g, "%2C").replace(/ /g, "+")
}