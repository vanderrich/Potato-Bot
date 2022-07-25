import { HandlerContext } from "$fresh/server.ts";
import { CreateError, Error } from "../../static/apistuff.ts";
import "dotenv";

export const handler = {
    POST(req: Request, ctx: HandlerContext) {
        const body = new URL(req.url).searchParams;
        if (req.headers.get("authorization") !== Deno.env.get("SUPER_SECRET_KEY")) return new Response("Unauthorized");
        if (!body.has("name") || !body.has("id") || !body.has("error") || !body.has("stack") || !body.has("type")) return new Response("Missing required fields");
        try {
            CreateError({
                name: body.get("name")!,
                id: body.get("id")!,
                error: body.get("error")!,
                type: body.get("type") as Error["type"],
                stack: body.get("stack")!,
                code: parseInt(body.get("code")!),
                path: body.get("path")!,
                httpStatus: parseInt(body.get("httpStatus")!),
            });
        } catch (e) {
            return new Response(JSON.stringify({
                message: "Internal Server Error",
                error: e
            }));
        }
        return new Response('Logged Error Successfully');
    }
}