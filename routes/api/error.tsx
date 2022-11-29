import { HandlerContext } from "$fresh/server.ts";
import { CreateError, Error } from "../../static/apistuff.ts";
import "dotenv";

export const handler = {
    async POST(req: Request, ctx: HandlerContext) {
        const searchParams = new URL(req.url).searchParams;
        let body: Error;
        if (req.headers.get("authorization") !== Deno.env.get("SUPER_SECRET_KEY")) return new Response("Unauthorized", { status: 401 });
        if (!searchParams.has("name") || !searchParams.has("id") || !searchParams.has("error") || !searchParams.has("stack") || !searchParams.has("type")) body = await req.json()
        else {
            body = {
                name: searchParams.get("name")!,
                id: searchParams.get("id")!,
                type: searchParams.get("type") as Error["type"],
                error: searchParams.get("error")!,
                stack: searchParams.get("stack")!,
                code: parseInt(searchParams.get("code")!),
                path: searchParams.get("path")!,
                httpStatus: parseInt(searchParams.get("httpStatus")!),
            }
        }
        console.log(body)
        if (!body.name || !body.id || !body.error || !body.stack || !body.type) return new Response("Missing required fields", { status: 400 });

        try {
            CreateError({
                name: body.name!,
                id: body.id!,
                error: body.error!,
                type: body.type as Error["type"],
                stack: body.stack!,
                code: body.code,
                path: body.path,
                httpStatus: body.httpStatus,
            });
        } catch (e) {
            console.error(e)
            return new Response("Internal Server Error", { status: 500 });
        }
        return new Response('Logged Error Successfully', { status: 200 });
    }
}