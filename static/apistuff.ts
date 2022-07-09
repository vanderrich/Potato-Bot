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

export let online = false;
export let onlineCooldown = 0;
export let uptime = 0;
export let newVotes: Vote[] = []
export const errors: Error[] = [];

setInterval(() => {
    onlineCooldown -= 100;
    uptime += 100;
    if (onlineCooldown <= 0) {
        online = false;
        uptime = 0;
        clearInterval(undefined);
    }
}, 100);

export const Ping = () => {
    online = true;
    onlineCooldown = 30000;
}

export const ClearVotes = () => {
    newVotes = [];
}