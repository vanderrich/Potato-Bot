import { HandlerContext } from "$fresh/server.ts";
import { online, uptime, errors, onlineCooldown, newVotes, Ping, ClearVotes } from "../../static/apistuff.ts"

export const handler = {
    GET(_req: Request, _ctx: HandlerContext) {
        const res = { message: online, uptime, errors }
        return new Response(JSON.stringify(res))
    },
    POST(_req: Request, _ctx: HandlerContext) {
        Ping();
        const newVotesTemp = newVotes;
        ClearVotes();
        return new Response(JSON.stringify({
            message: onlineCooldown,
            newVotes: newVotesTemp
        }));
    }
};
