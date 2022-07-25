import { HandlerContext } from "$fresh/server.ts";
import { newVotes } from "../../static/apistuff.ts";
import "dotenv";

export const handler = {
    POST(req: Request, ctx: HandlerContext) {
        const body = new URL(req.url).searchParams;
        if (req.headers.get("authorization") !== Deno.env.get("SUPER_SECRET_KEY")) return new Response("Unauthorized");

        newVotes.push({
            user: body.get("user") || body.get("id")!,
            bot: body.get("bot")!,
            source: req.headers.get("user-agent")?.startsWith("Top.gg Webhook/") ? "top.gg" : req.headers.get("user-agent") ? "discordbotlist" : "unknown"
        })

        return new Response('Vote has been logged successfully');
    }
}